import { Building2, MapPin, DollarSign } from "lucide-react";
import Input from "../ui/Input";

export default function BasicInfoSection({ formData, handleInputChange }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
        <Building2 className="w-4 h-4 text-emerald-600" /> Osnovne informacije
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Naziv terena"
          type="text"
          name="naziv"
          required
          value={formData.naziv}
          onChange={handleInputChange}
          placeholder="npr. Sportski Centar Olimpic"
        />

        <Input
          label="Cena po satu (RSD)"
          type="number"
          name="cena_po_satu"
          required
          min="0"
          icon={DollarSign}
          value={formData.cena_po_satu}
          onChange={handleInputChange}
          placeholder="2500"
        />

        <Input
          label="Grad"
          type="text"
          name="grad"
          required
          icon={MapPin}
          value={formData.grad}
          onChange={handleInputChange}
          placeholder="Beograd"
        />

        <Input
          label="Adresa"
          type="text"
          name="adresa"
          required
          value={formData.adresa}
          onChange={handleInputChange}
          placeholder="Bulevar oslobođenja 12"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Opis
        </label>
        <textarea
          name="opis"
          rows={3}
          value={formData.opis}
          onChange={handleInputChange}
          placeholder="Kratak opis terena, podloge, pratećih objekata..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
        />
      </div>

      <div className="flex items-center gap-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 select-none">
          <input
            type="checkbox"
            name="natkriven"
            checked={formData.natkriven}
            onChange={handleInputChange}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          Teren je natkriven
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 select-none">
          <input
            type="checkbox"
            name="aktivan"
            checked={formData.aktivan}
            onChange={handleInputChange}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          Teren je aktivan za rezervacije
        </label>
      </div>
    </div>
  );
}
