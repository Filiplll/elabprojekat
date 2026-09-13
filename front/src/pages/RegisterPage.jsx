import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, UserCheck, UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import Select from "../components/ui/Select";

const USER_TYPES = [
  { value: "igrac", label: "Igrač (Rezervacija terena)" },
  { value: "vlasnik", label: "Vlasnik (Upravljanje terenima)" },
];

const INITIAL_STATE = {
  ime: "",
  prezime: "",
  email: "",
  password: "",
  password_confirmation: "",
  type: "igrac",
};

export default function RegisterPage() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [validationError, setValidationError] = useState(null);
  const { register, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const { ime, prezime, email, password, password_confirmation, type } =
    formData;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
    if (validationError) setValidationError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setValidationError("Lozinka mora imati najmanje 8 karaktera.");
      return;
    }

    if (password !== password_confirmation) {
      setValidationError("Lozinke se ne poklapaju.");
      return;
    }

    const result = await register(formData);
    if (result.success) navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Kreirajte novi nalog
          </h2>
          <p className="text-sm text-slate-500">
            Pridružite se platformi za iznajmljivanje sportskih terena
          </p>
        </div>

        <ErrorMessage message={validationError || error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ime"
              id="ime"
              name="ime"
              icon={User}
              theme="emerald"
              value={ime}
              onChange={handleChange}
              placeholder="Unesite ime"
              required
            />
            <Input
              label="Prezime"
              id="prezime"
              name="prezime"
              icon={User}
              theme="emerald"
              value={prezime}
              onChange={handleChange}
              placeholder="Unesite prezime"
              required
            />
          </div>

          <Input
            label="Email adresa"
            id="email"
            name="email"
            type="email"
            icon={Mail}
            theme="emerald"
            value={email}
            onChange={handleChange}
            placeholder="Unesite email"
            required
          />

          <Input
            label="Lozinka"
            id="password"
            name="password"
            type="password"
            icon={Lock}
            theme="emerald"
            value={password}
            onChange={handleChange}
            placeholder="Najmanje 8 karaktera"
            required
          />

          <Input
            label="Potvrda lozinke"
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            icon={Lock}
            theme="emerald"
            value={password_confirmation}
            onChange={handleChange}
            placeholder="Ponovite lozinku"
            required
          />

          <Select
            label="Tip korisnika"
            id="type"
            name="type"
            icon={UserCheck}
            theme="emerald"
            value={type}
            onChange={handleChange}
            options={USER_TYPES}
            placeholder=""
            required
          />

          <Button
            type="submit"
            variant="primary"
            icon={UserPlus}
            loading={loading}
            className="w-full py-2.5 text-base mt-2"
          >
            Registruj se
          </Button>
        </form>

        <div className="pt-2 text-center text-sm text-slate-600 border-t border-slate-100">
          Već imate nalog?{" "}
          <Link
            to="/"
            className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
          >
            Prijavite se
          </Link>
        </div>
      </div>
    </div>
  );
}
