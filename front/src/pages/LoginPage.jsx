import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, Trophy } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) navigate("/home");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Trophy className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Prijava na sistem
          </h2>
          <p className="text-sm text-slate-500">
            Prijavite se da biste rezervisali sportske terene
          </p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email adresa"
            id="email"
            name="email"
            type="email"
            icon={Mail}
            theme="emerald"
            value={formData.email}
            onChange={handleChange}
            placeholder="Unesite vaš email"
            required
          />

          <Input
            label="Lozinka"
            id="password"
            name="password"
            type="password"
            icon={Lock}
            theme="emerald"
            value={formData.password}
            onChange={handleChange}
            placeholder="Unesite vašu lozinku"
            required
          />

          <Button
            type="submit"
            variant="primary"
            icon={LogIn}
            loading={loading}
            className="w-full py-2.5 text-base"
          >
            Prijavi se
          </Button>
        </form>

        <div className="pt-2 text-center text-sm text-slate-600 border-t border-slate-100">
          Nemate nalog?{" "}
          <Link
            to="/register"
            className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
          >
            Registrujte se
          </Link>
        </div>
      </div>
    </div>
  );
}
