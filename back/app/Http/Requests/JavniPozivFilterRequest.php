<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class JavniPozivFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'grad' => 'nullable|string|max:255',
            'sport_id' => 'nullable|integer|exists:sportovi,id',
            'teren_id' => 'nullable|integer|exists:tereni,id',
            'od_datuma' => 'nullable|date_format:Y-m-d',
            'do_datuma' => 'nullable|date_format:Y-m-d|after_or_equal:od_datuma',
            'order' => 'nullable|string|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'sport_id.exists' => 'Izabrani sport ne postoji.',
            'teren_id.exists' => 'Izabrani teren ne postoji.',
            'od_datuma.date_format' => 'Datum se šalje u obliku GGGG-MM-DD.',
            'do_datuma.date_format' => 'Datum se šalje u obliku GGGG-MM-DD.',
            'do_datuma.after_or_equal' => 'Kraj raspona ne može biti pre početka.',
            'per_page.max' => 'Najviše 100 poziva po strani.',
        ];
    }
}
