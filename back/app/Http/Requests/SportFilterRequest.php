<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class SportFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() ;
    }

    public function rules(): array
    {
        return [
            'naziv' => 'nullable|string|max:255',
            'sort_by' => 'nullable|string|in:naziv,created_at',
            'order' => 'nullable|string|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'sort_by.in' => 'Sortiranje je moguće samo po: naziv, created_at.',
            'order.in' => 'Smer sortiranja može biti asc ili desc.',
            'per_page.max' => 'Najviše 100 sportova po strani.',
            'per_page.min' => 'Broj sportova po strani mora biti najmanje 1.',
        ];
    }
}
