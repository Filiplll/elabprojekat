<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class PridruzivanjeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->isIgrac();
    }

    public function rules(): array
    {
        return [];
    }
}
