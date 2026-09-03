<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class RezervacijaRequest extends FormRequest
{
    private const KORAK = 30;

    private const NAJKRACE = 60;

    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->isIgrac();
    }

    protected function prepareForValidation(): void
    {
        foreach (['vreme_od', 'vreme_do'] as $polje) {
            if (is_string($this->input($polje))) {
                $this->merge([$polje => substr(trim($this->input($polje)), 0, 5)]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'datum' => 'required|date_format:Y-m-d|after_or_equal:today',
            'vreme_od' => 'required|date_format:H:i',
            'vreme_do' => 'required|date_format:H:i',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $od = $this->uMinutima($this->input('vreme_od'));
            $do = $this->uMinutima($this->input('vreme_do'));
            $trajanje = $do - $od;

            if ($trajanje <= 0) {
                $validator->errors()->add('vreme_do', 'Kraj termina mora biti posle početka.');

                return;
            }

            if ($trajanje < self::NAJKRACE) {
                $validator->errors()->add('vreme_do', 'Termin ne može biti kraći od sat vremena.');
            }

            if ($trajanje % self::KORAK !== 0) {
                $validator->errors()->add('vreme_do', 'Trajanje ide po pola sata: 1h, 1h 30min, 2h i tako dalje.');
            }

            $pocetak = Carbon::parse($this->input('datum') . ' ' . $this->input('vreme_od'));

            if ($pocetak->isPast()) {
                $validator->errors()->add('vreme_od', 'Termin ne može biti u prošlosti.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'datum.required' => 'Datum je obavezan.',
            'datum.date_format' => 'Datum se šalje u obliku GGGG-MM-DD.',
            'datum.after_or_equal' => 'Termin ne može biti u prošlosti.',
            'vreme_od.required' => 'Vreme početka je obavezno.',
            'vreme_od.date_format' => 'Vreme početka se šalje u obliku HH:MM.',
            'vreme_do.required' => 'Vreme kraja je obavezno.',
            'vreme_do.date_format' => 'Vreme kraja se šalje u obliku HH:MM.',
        ];
    }

    private function uMinutima(string $vreme): int
    {
        [$sat, $minut] = explode(':', $vreme);

        return ((int) $sat) * 60 + (int) $minut;
    }
}
