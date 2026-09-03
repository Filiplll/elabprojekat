<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecenzijaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ocena' => $this->ocena,
            'ocena_prikaz' => $this->ocena_prikaz,
            'komentar' => $this->komentar,
            'status' => $this->status,
            'autor' => $this->whenLoaded('igrac', fn () => [
                'id' => $this->igrac->id,
                'puno_ime' => $this->igrac->puno_ime,
            ]),
            'rezervacija' => $this->whenLoaded('rezervacija', fn () => [
                'id' => $this->rezervacija->id,
                'termin' => $this->rezervacija->termin,
                'teren' => $this->rezervacija->relationLoaded('teren') ? [
                    'id' => $this->rezervacija->teren->id,
                    'naziv' => $this->rezervacija->teren->naziv,
                    'grad' => $this->rezervacija->teren->grad,
                ] : null,
            ]),
            'created_at' => $this->created_at?->format('d.m.Y. H:i'),
            'updated_at' => $this->updated_at?->format('d.m.Y. H:i'),
        ];
    }
}
