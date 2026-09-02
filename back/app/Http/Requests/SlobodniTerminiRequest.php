<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class SlobodniTerminiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'datum' => 'required|date_format:Y-m-d',
            'trajanje' => 'nullable|integer|min:60|max:720',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $trajanje = $this->input('trajanje');

            if ($trajanje !== null && (int) $trajanje % 30 !== 0) {
                $validator->errors()->add('trajanje', 'Trajanje ide po pola sata: 60, 90, 120 i tako dalje.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'datum.required' => 'Datum je obavezan.',
            'datum.date_format' => 'Datum se šalje u obliku GGGG-MM-DD.',
            'trajanje.min' => 'Termin ne može biti kraći od sat vremena.',
            'trajanje.max' => 'Termin ne može biti duži od 12 sati.',
        ];
    }

    public function trajanje(): int
    {
        return (int) ($this->validated()['trajanje'] ?? 60);
    }
}
