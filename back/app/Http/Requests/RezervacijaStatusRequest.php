<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class RezervacijaStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('rezervacija')?->naTerenuVlasnika(Auth::user()) ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|string|in:potvrdjena,otkazana',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status je obavezan.',
            'status.in' => 'Vlasnik može postaviti status na potvrdjena ili otkazana.',
        ];
    }
}
