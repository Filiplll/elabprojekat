<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class TerenOwnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('teren')?->pripada(Auth::user()) ?? false;
    }

    public function rules(): array
    {
        return [];
    }
}
