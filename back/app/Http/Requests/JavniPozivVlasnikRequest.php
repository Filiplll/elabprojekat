<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class JavniPozivVlasnikRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('poziv')?->pripada(Auth::user()) ?? false;
    }

    public function rules(): array
    {
        return [];
    }
}
