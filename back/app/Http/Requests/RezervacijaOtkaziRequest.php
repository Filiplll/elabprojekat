<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class RezervacijaOtkaziRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('rezervacija')?->pripada(Auth::user()) ?? false;
    }

    public function rules(): array
    {
        return [];
    }
}
