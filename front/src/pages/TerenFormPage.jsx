import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, Save, ArrowLeft } from "lucide-react";

import { useTereni } from "../hooks/useTereni";
import { useSportovi } from "../hooks/useSportovi";
import Navbar from "../components/ui/Navbar";
import Button from "../components/ui/Button";
import BasicInfoSection from "../components/terenForm/BasicInfoSection";
import SportsSelector from "../components/terenForm/SportsSelector";
import WorkingHoursSection from "../components/terenForm/WorkingHoursSection";

const INITIAL_DAYS = [
  {
    dan_u_nedelji: 0,
    naziv: "Ponedeljak",
    radi: true,
    otvara_u: "08:00",
    zatvara_u: "23:00",
  },
  {
    dan_u_nedelji: 1,
    naziv: "Utorak",
    radi: true,
    otvara_u: "08:00",
    zatvara_u: "23:00",
  },
  {
    dan_u_nedelji: 2,
    naziv: "Sreda",
    radi: true,
    otvara_u: "08:00",
    zatvara_u: "23:00",
  },
  {
    dan_u_nedelji: 3,
    naziv: "Četvrtak",
    radi: true,
    otvara_u: "08:00",
    zatvara_u: "23:00",
  },
  {
    dan_u_nedelji: 4,
    naziv: "Petak",
    radi: true,
    otvara_u: "08:00",
    zatvara_u: "23:00",
  },
  {
    dan_u_nedelji: 5,
    naziv: "Subota",
    radi: true,
    otvara_u: "08:00",
    zatvara_u: "23:00",
  },
  {
    dan_u_nedelji: 6,
    naziv: "Nedelja",
    radi: true,
    otvara_u: "08:00",
    zatvara_u: "23:00",
  },
];

export default function TerenForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchTerenById,
    createTeren,
    updateTeren,
    actionLoading,
    loading,
    error: apiError,
  } = useTereni();
  const { sportovi, fetchSportovi } = useSportovi();

  const [formData, setFormData] = useState({
    naziv: "",
    grad: "",
    adresa: "",
    cena_po_satu: "",
    natkriven: false,
    aktivan: true,
    opis: "",
    sportovi: [],
    radno_vreme: INITIAL_DAYS,
  });

  const [validationError, setValidationError] = useState("");
  const isEditMode = Boolean(id);

  useEffect(() => {
    fetchSportovi(1, 100);
  }, []);

  const populateForm = (data) => {
    setFormData({
      naziv: data.naziv || "",
      grad: data.grad || "",
      adresa: data.adresa || "",
      cena_po_satu: data.cena_po_satu || "",
      natkriven: Boolean(data.natkriven),
      aktivan: data.aktivan !== undefined ? Boolean(data.aktivan) : true,
      opis: data.opis || "",
      sportovi: data.sportovi
        ? data.sportovi.map((s) => (typeof s === "object" ? s.id : s))
        : [],
      radno_vreme:
        data.radno_vreme && data.radno_vreme.length > 0
          ? INITIAL_DAYS.map((day) => {
              const found = data.radno_vreme.find(
                (rv) => rv.dan_u_nedelji === day.dan_u_nedelji,
              );
              return found
                ? {
                    ...day,
                    radi: Boolean(found.radi),
                    otvara_u: found.otvara_u,
                    zatvara_u: found.zatvara_u,
                  }
                : day;
            })
          : INITIAL_DAYS,
    });
  };

  useEffect(() => {
    if (isEditMode) {
      fetchTerenById(id).then((data) => {
        if (data) populateForm(data);
      });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSportToggle = (sportId) => {
    setFormData((prev) => {
      const exists = prev.sportovi.includes(sportId);
      return {
        ...prev,
        sportovi: exists
          ? prev.sportovi.filter((sId) => sId !== sportId)
          : [...prev.sportovi, sportId],
      };
    });
  };

  const handleWorkingHourChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.radno_vreme];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, radno_vreme: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (formData.sportovi.length === 0) {
      setValidationError("Morate izabrati bar jedan sport.");
      return;
    }

    const payload = {
      ...formData,
      cena_po_satu: Number(formData.cena_po_satu),
      radno_vreme: formData.radno_vreme.map(
        ({ dan_u_nedelji, radi, otvara_u, zatvara_u }) => {
          if (!radi) {
            return {
              dan_u_nedelji,
              radi: false,
              otvara_u: null,
              zatvara_u: null,
            };
          }

          const formatTime = (time, defaultTime) => {
            if (!time) return defaultTime;
            if (time === "24:00") return "23:59";
            return time;
          };

          return {
            dan_u_nedelji,
            radi: true,
            otvara_u: formatTime(otvara_u, "08:00"),
            zatvara_u: formatTime(zatvara_u, "23:59"),
          };
        },
      ),
    };

    try {
      if (isEditMode) {
        await updateTeren(id, payload);
      } else {
        await createTeren(payload);
      }
      navigate("/tereni?view=my");
    } catch (err) {
      console.error("Greška pri sačuvanju terena:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
            Nazad
          </Button>
          <h1 className="text-xl font-bold text-slate-900">
            {isEditMode ? "Izmena terena" : "Kreiranje novog terena"}
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {(validationError || apiError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{validationError || apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <BasicInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <hr className="border-slate-100" />

            <SportsSelector
              sportovi={sportovi}
              selectedSports={formData.sportovi}
              onToggle={handleSportToggle}
            />

            <hr className="border-slate-100" />

            <WorkingHoursSection
              radnoVreme={formData.radno_vreme}
              onChange={handleWorkingHourChange}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={actionLoading}
              >
                Otkaži
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={Save}
                loading={actionLoading}
              >
                {isEditMode ? "Sačuvaj izmene" : "Kreiraj teren"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
