import { Calendar, Search } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

export default function RezervacijaTerminaSection({
  datum,
  setDatum,
  trajanje,
  setTrajanje,
  trajanjeOptions,
  selectedTermin,
  setSelectedTermin,
  slobodniTerminiData,
  terminiLoading,
  terminiError,
  clearSlobodniTermini,
  handleFindTermini,
  handleConfirmReservation,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-emerald-600" />
          Rezervacija termina
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Izaberite željeni datum i trajanje utakmice/treninga kako biste
          proverili raspoloživost.
        </p>
      </div>

      <form
        onSubmit={handleFindTermini}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 items-end"
      >
        <Input
          label="Datum"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={datum}
          onChange={(e) => {
            setDatum(e.target.value);
            clearSlobodniTermini();
          }}
          required
        />

        <Select
          label="Trajanje (min)"
          value={trajanje}
          onChange={(e) => {
            setTrajanje(e.target.value);
            clearSlobodniTermini();
          }}
          options={trajanjeOptions}
        />

        <Button
          type="submit"
          variant="primary"
          icon={Search}
          disabled={terminiLoading}
          className="w-full py-2.5 h-10.5"
        >
          {terminiLoading ? "Učitavanje..." : "Prikaži termine"}
        </Button>
      </form>

      {terminiError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
          {terminiError}
        </div>
      )}

      {slobodniTerminiData && (
        <div className="space-y-5 pt-2">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div className="text-sm text-slate-600">
              Slobodni slotovi za:{" "}
              <span className="font-bold text-slate-800">
                {slobodniTerminiData.datum} ({slobodniTerminiData.dan})
              </span>
            </div>
            <div className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">
              Radno vreme: {slobodniTerminiData.radno_vreme}
            </div>
          </div>

          {!slobodniTerminiData.radi ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm font-medium">
              Teren ne radi izabranom danu.
            </div>
          ) : slobodniTerminiData.termini?.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm">
              Nema dostupnih termina za izabrano trajanje.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {slobodniTerminiData.termini.map((slot, index) => {
                  const isSelected =
                    selectedTermin?.vreme_od === slot.vreme_od &&
                    selectedTermin?.vreme_do === slot.vreme_do;

                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={!slot.slobodno}
                      onClick={() => setSelectedTermin(slot)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        !slot.slobodno
                          ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                          : isSelected
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200 font-bold scale-[1.02]"
                            : "bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50"
                      }`}
                    >
                      <span className="text-sm">
                        {slot.vreme_od} - {slot.vreme_do}
                      </span>
                      {!slot.slobodno && slot.razlog && (
                        <span className="text-[10px] text-slate-400">
                          {slot.razlog}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedTermin && (
                <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                        Izabrani termin
                      </p>
                      <p className="text-base font-bold text-emerald-950">
                        {slobodniTerminiData.datum} | {selectedTermin.vreme_od}{" "}
                        - {selectedTermin.vreme_do}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    disabled={terminiLoading}
                    variant="primary"
                    onClick={handleConfirmReservation}
                    className="w-full sm:w-auto py-2.5 px-6"
                  >
                    Rezerviši
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
