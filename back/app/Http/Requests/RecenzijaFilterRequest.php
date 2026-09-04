<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class RecenzijaFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
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
            'ocena.between' => 'Ocena ide od 1 do 5.',
            'min_ocena.between' => 'Ocena ide od 1 do 5.',
            'sort_by.in' => 'Sortiranje je moguće samo po: ocena, created_at.',
            'per_page.max' => 'Najviše 100 recenzija po strani.',
        ];
    }
}
