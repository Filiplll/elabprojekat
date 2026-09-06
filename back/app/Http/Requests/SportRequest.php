<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class SportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->isAdmin();
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('naziv')) {
            $this->merge(['naziv' => trim((string) $this->naziv)]);
        }
    }

    public function rules(): array
    {
        return [
            'naziv' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sportovi', 'naziv')->ignore($this->route('sport')),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'naziv.required' => 'Naziv sporta je obavezan.',
            'naziv.string' => 'Naziv sporta mora biti tekst.',
            'naziv.max' => 'Naziv sporta ne može biti duži od 255 karaktera.',
            'naziv.unique' => 'Sport sa ovim nazivom već postoji.',
        ];
    }
}
