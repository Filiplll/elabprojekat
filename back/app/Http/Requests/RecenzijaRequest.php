<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class RecenzijaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check()
            && Auth::user()->isIgrac()
            && ($this->route('rezervacija')?->jeUcesnik(Auth::user()) ?? false);
    }

    public function rules(): array
    {
        return [
            'ocena' => 'required|integer|between:1,5',
            'komentar' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'ocena.required' => 'Ocena je obavezna.',
            'ocena.integer' => 'Ocena mora biti ceo broj.',
            'ocena.between' => 'Ocena ide od 1 do 5.',
            'komentar.max' => 'Komentar ne može biti duži od 1000 karaktera.',
        ];
    }
}
