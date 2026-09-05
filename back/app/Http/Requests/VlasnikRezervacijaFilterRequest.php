<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class VlasnikRezervacijaFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->isVlasnik();
    }

    public function rules(): array
    {
        return [
            'status' => 'nullable|string|in:na_cekanju,potvrdjena,otkazana,odigrana',
            'teren_id' => 'nullable|integer|exists:tereni,id',
            'igrac_id' => 'nullable|integer|exists:users,id',
            'od_datuma' => 'nullable|date_format:Y-m-d',
            'do_datuma' => 'nullable|date_format:Y-m-d|after_or_equal:od_datuma',
            'sort_by' => 'nullable|string|in:datum,created_at',
            'order' => 'nullable|string|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Status može biti: na_cekanju, potvrdjena, otkazana, odigrana.',
            'teren_id.exists' => 'Izabrani teren ne postoji.',
            'igrac_id.exists' => 'Izabrani igrač ne postoji.',
            'od_datuma.date_format' => 'Datum se šalje u obliku GGGG-MM-DD.',
            'do_datuma.date_format' => 'Datum se šalje u obliku GGGG-MM-DD.',
            'do_datuma.after_or_equal' => 'Kraj raspona ne može biti pre početka.',
            'sort_by.in' => 'Sortiranje je moguće samo po: datum, created_at.',
            'per_page.max' => 'Najviše 100 rezervacija po strani.',
        ];
    }
}
