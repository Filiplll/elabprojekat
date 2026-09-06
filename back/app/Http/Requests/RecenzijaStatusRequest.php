<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class RecenzijaStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'status' => 'required|string|in:odobrena,odbijena',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status je obavezan.',
            'status.in' => 'Admin može postaviti status na odobrena ili odbijena.',
        ];
    }
}
