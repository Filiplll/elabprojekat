<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class JavniPozivIzmenaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('poziv')?->pripada(Auth::user()) ?? false;
    }

    public function rules(): array
    {
        return [
            'broj_slobodnih_mesta' => 'sometimes|integer|min:1|max:50',
            'opis' => 'sometimes|nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'broj_slobodnih_mesta.integer' => 'Broj slobodnih mesta mora biti ceo broj.',
            'broj_slobodnih_mesta.min' => 'Poziv mora imati bar jedno slobodno mesto.',
            'broj_slobodnih_mesta.max' => 'Najviše 50 slobodnih mesta.',
            'opis.max' => 'Opis ne može biti duži od 1000 karaktera.',
        ];
    }
}
