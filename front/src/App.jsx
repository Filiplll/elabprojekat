import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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
