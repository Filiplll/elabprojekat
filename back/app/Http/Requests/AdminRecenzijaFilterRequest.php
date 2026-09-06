<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class AdminRecenzijaFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'status' => 'nullable|string|in:na_cekanju,odobrena,odbijena',
            'teren_id' => 'nullable|integer|exists:tereni,id',
            'ocena' => 'nullable|integer|between:1,5',
            'min_ocena' => 'nullable|integer|between:1,5',
            'sort_by' => 'nullable|string|in:ocena,created_at',
            'order' => 'nullable|string|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Status može biti: na_cekanju, odobrena, odbijena.',
            'teren_id.exists' => 'Izabrani teren ne postoji.',
            'ocena.between' => 'Ocena ide od 1 do 5.',
            'sort_by.in' => 'Sortiranje je moguće samo po: ocena, created_at.',
            'per_page.max' => 'Najviše 100 recenzija po strani.',
        ];
    }
}
