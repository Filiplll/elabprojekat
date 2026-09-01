<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ime' => $this->ime,
            'prezime' => $this->prezime,
            'puno_ime' => $this->puno_ime,
            'email' => $this->email,
            'type' => $this->type,
            'banovan' => $this->banovan,
            'broj_terena' => $this->whenCounted('tereni'),
            'broj_rezervacija' => $this->whenCounted('rezervacije'),
            'broj_recenzija' => $this->whenCounted('recenzije'),
            'created_at' => $this->created_at?->format('d.m.Y. H:i'),
        ];
    }
}
