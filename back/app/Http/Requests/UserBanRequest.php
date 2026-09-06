<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UserBanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'banovan' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'banovan.boolean' => 'Polje banovan prima true ili false.',
        ];
    }

    public function zeljeniStatus(): ?bool
    {
        return array_key_exists('banovan', $this->validated())
            ? $this->boolean('banovan')
            : null;
    }
}
