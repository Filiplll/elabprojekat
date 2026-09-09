import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoutes";
import TereniPage from "./pages/TereniPage";
import TerenDetailsPage from "./pages/TerenDetailsPage";
import TerenForm from "./pages/TerenFormPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/tereni" element={<TereniPage />} />
          <Route path="/tereni/:id" element={<TerenDetailsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["vlasnik"]} />}>
          <Route path="/tereni/:id/izmena" element={<TerenForm />} />
          <Route path="/create-teren" element={<TerenForm />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="p-8 text-center text-xl font-semibold">
              404 - Stranica nije pronađena
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
