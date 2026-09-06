<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UserFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'pretraga' => 'nullable|string|max:255',
            'type' => 'nullable|string|in:vlasnik,igrac',
            'banovan' => 'nullable|boolean',
            'sort_by' => 'nullable|string|in:ime,prezime,email,created_at',
            'order' => 'nullable|string|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'type.in' => 'Pregled obuhvata samo vlasnike i igrače.',
            'banovan.boolean' => 'Polje banovan prima 1 ili 0.',
            'sort_by.in' => 'Sortiranje je moguće samo po: ime, prezime, email, created_at.',
            'order.in' => 'Smer sortiranja može biti asc ili desc.',
            'per_page.max' => 'Najviše 100 korisnika po strani.',
            'per_page.min' => 'Broj korisnika po strani mora biti najmanje 1.',
        ];
    }
}
