<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class AdminTerenFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'naziv' => 'nullable|string|max:255',
            'grad' => 'nullable|string|max:255',
            'sport_id' => 'nullable|integer|exists:sportovi,id',
            'vlasnik_id' => 'nullable|integer|exists:users,id',
            'aktivan' => 'nullable|boolean',
            'natkriven' => 'nullable|boolean',
            'max_cena' => 'nullable|numeric|min:0',
            'sort_by' => 'nullable|string|in:naziv,grad,cena_po_satu,created_at',
            'order' => 'nullable|string|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'sport_id.exists' => 'Izabrani sport ne postoji.',
            'vlasnik_id.exists' => 'Izabrani vlasnik ne postoji.',
            'aktivan.boolean' => 'Polje aktivan prima 1 ili 0.',
            'sort_by.in' => 'Sortiranje je moguće samo po: naziv, grad, cena_po_satu, created_at.',
            'order.in' => 'Smer sortiranja može biti asc ili desc.',
            'per_page.max' => 'Najviše 100 terena po strani.',
        ];
    }
}
