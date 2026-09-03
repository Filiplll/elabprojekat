<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;

class RezervacijaTerminRequest extends RezervacijaRequest
{
    public function authorize(): bool
    {
        return $this->route('rezervacija')?->pripada(Auth::user()) ?? false;
    }
}
