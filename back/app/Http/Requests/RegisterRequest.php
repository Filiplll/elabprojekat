<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'type' => 'required|string|in:vlasnik,igrac',
        ];
    }

    public function messages(): array
    {
        return [
            'ime.required' => 'Ime je obavezno polje.',
            'ime.max' => 'Ime ne može biti duže od 255 karaktera.',
            'prezime.required' => 'Prezime je obavezno polje.',
            'prezime.max' => 'Prezime ne može biti duže od 255 karaktera.',
            'email.required' => 'Email adresa je obavezna.',
            'email.email' => 'Format email adrese nije validan.',
            'email.unique' => 'Ova email adresa je već zauzeta.',
            'email.max' => 'Email ne može biti duži od 255 karaktera.',
            'password.required' => 'Lozinka je obavezna.',
            'password.min' => 'Lozinka mora imati najmanje 8 karaktera.',
            'type.required' => 'Tip naloga je obavezan.',
            'type.in' => 'Registracija je moguća samo kao vlasnik ili igrač.',
        ];
    }
}
