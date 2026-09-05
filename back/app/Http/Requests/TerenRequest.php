<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class TerenRequest extends FormRequest
{
    public function authorize(): bool
    {
        $teren = $this->route('teren');

        if ($teren) {
            return $teren->pripada(Auth::user());
        }

        return Auth::check() && Auth::user()->isVlasnik();
    }

    protected function prepareForValidation(): void
    {
        foreach (['naziv', 'grad', 'adresa'] as $polje) {
            if ($this->has($polje)) {
                $this->merge([$polje => trim((string) $this->input($polje))]);
            }
        }

        if (! is_array($this->input('radno_vreme'))) {
            return;
        }

        $dani = array_map(function ($dan) {
            foreach (['otvara_u', 'zatvara_u'] as $polje) {
                if (is_string($dan[$polje] ?? null)) {
                    $dan[$polje] = substr(trim($dan[$polje]), 0, 5);
                }
            }

            return $dan;
        }, $this->input('radno_vreme'));

        $this->merge(['radno_vreme' => $dani]);
    }

    public function rules(): array
    {
        return [
            'naziv' => 'required|string|max:255',
            'grad' => 'required|string|max:255',
            'adresa' => 'required|string|max:255',
            'cena_po_satu' => 'required|numeric|min:0|max:999999.99',
            'natkriven' => 'sometimes|boolean',
            'aktivan' => 'sometimes|boolean',
            'opis' => 'nullable|string|max:2000',
            'sportovi' => 'sometimes|array',
            'sportovi.*' => 'integer|distinct|exists:sportovi,id',
            'radno_vreme' => 'sometimes|array|size:7',
            'radno_vreme.*.dan_u_nedelji' => 'required|integer|between:0,6|distinct',
            'radno_vreme.*.radi' => 'required|boolean',
            'radno_vreme.*.otvara_u' => 'nullable|date_format:H:i',
            'radno_vreme.*.zatvara_u' => 'nullable|date_format:H:i',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            foreach ($this->input('radno_vreme', []) as $i => $dan) {
                if (! filter_var($dan['radi'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
                    continue;
                }

                $otvara = $dan['otvara_u'] ?? null;
                $zatvara = $dan['zatvara_u'] ?? null;

                if (! $otvara) {
                    $validator->errors()->add("radno_vreme.{$i}.otvara_u", 'Za dan u kojem teren radi mora se navesti vreme otvaranja.');
                }

                if (! $zatvara) {
                    $validator->errors()->add("radno_vreme.{$i}.zatvara_u", 'Za dan u kojem teren radi mora se navesti vreme zatvaranja.');
                }

                $formatNijeValjan = $validator->errors()->has("radno_vreme.{$i}.otvara_u")
                    || $validator->errors()->has("radno_vreme.{$i}.zatvara_u");

                if ($otvara && $zatvara && ! $formatNijeValjan && $zatvara <= $otvara) {
                    $validator->errors()->add("radno_vreme.{$i}.zatvara_u", 'Vreme zatvaranja mora biti posle vremena otvaranja.');
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'naziv.required' => 'Naziv terena je obavezan.',
            'naziv.max' => 'Naziv terena ne može biti duži od 255 karaktera.',
            'grad.required' => 'Grad je obavezan.',
            'adresa.required' => 'Adresa je obavezna.',
            'cena_po_satu.required' => 'Cena po satu je obavezna.',
            'cena_po_satu.numeric' => 'Cena po satu mora biti broj.',
            'cena_po_satu.min' => 'Cena po satu ne može biti negativna.',
            'cena_po_satu.max' => 'Cena po satu je prevelika.',
            'natkriven.boolean' => 'Polje natkriven prima true ili false.',
            'aktivan.boolean' => 'Polje aktivan prima true ili false.',
            'opis.max' => 'Opis ne može biti duži od 2000 karaktera.',
            'sportovi.array' => 'Sportovi se šalju kao lista id-jeva.',
            'sportovi.*.exists' => 'Jedan od izabranih sportova ne postoji.',
            'sportovi.*.distinct' => 'Isti sport je naveden više puta.',
            'radno_vreme.array' => 'Radno vreme se šalje kao lista dana.',
            'radno_vreme.size' => 'Radno vreme mora imati tačno 7 dana, od ponedeljka do nedelje.',
            'radno_vreme.*.dan_u_nedelji.required' => 'Svaki dan mora imati dan_u_nedelji.',
            'radno_vreme.*.dan_u_nedelji.between' => 'dan_u_nedelji ide od 0 (ponedeljak) do 6 (nedelja).',
            'radno_vreme.*.dan_u_nedelji.distinct' => 'Isti dan u nedelji je naveden više puta.',
            'radno_vreme.*.radi.required' => 'Za svaki dan mora se reći da li teren radi.',
            'radno_vreme.*.radi.boolean' => 'Polje radi prima true ili false.',
            'radno_vreme.*.otvara_u.date_format' => 'Vreme otvaranja se šalje u obliku HH:MM.',
            'radno_vreme.*.zatvara_u.date_format' => 'Vreme zatvaranja se šalje u obliku HH:MM.',
        ];
    }
}
