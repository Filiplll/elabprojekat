<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TerenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'grad' => $this->grad,
            'adresa' => $this->adresa,
            'cena_formatirana' => $this->formatirana_cena,
            'cena_po_satu' => (float) $this->cena_po_satu,
            'natkriven' => $this->natkriven,
            'aktivan' => $this->aktivan,
            'opis' => $this->opis,
            'sportovi' => $this->whenLoaded('sportovi', fn () => $this->sportovi->map(fn ($sport) => [
                'id' => $sport->id,
                'naziv' => $sport->naziv,
            ])),
            'radno_vreme' => $this->whenLoaded('radnoVreme', fn () => $this->radnoVreme->map(fn ($dan) => [
                'dan_u_nedelji' => $dan->dan_u_nedelji,
                'naziv_dana' => $dan->naziv_dana,
                'radi' => $dan->radi,
                'otvara_u' => $dan->radi ? substr((string) $dan->otvara_u, 0, 5) : null,
                'zatvara_u' => $dan->radi ? substr((string) $dan->zatvara_u, 0, 5) : null,
                'prikaz' => $dan->radno_vreme,
            ])),
            'broj_rezervacija' => $this->whenCounted('rezervacije'),
            'vlasnik' => $this->whenLoaded('vlasnik', fn () => [
                'id' => $this->vlasnik->id,
                'puno_ime' => $this->vlasnik->puno_ime,
            ]),
            'created_at' => $this->created_at?->format('d.m.Y. H:i'),
        ];
    }
}
