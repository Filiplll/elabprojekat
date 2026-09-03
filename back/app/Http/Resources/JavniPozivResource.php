<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JavniPozivResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $korisnik = $request->user();

        return [
            'id' => $this->id,
            'opis' => $this->opis,
            'aktivan' => $this->aktivan,
            'broj_slobodnih_mesta' => $this->broj_slobodnih_mesta,
            'broj_prijavljenih' => $this->broj_prijavljenih,
            'slobodno_mesta' => $this->slobodno_mesta,
            'otvoren_za_prijave' => $this->jeOtvoren() && $this->slobodno_mesta > 0,
            'rezervacija' => $this->whenLoaded('rezervacija', fn () => [
                'id' => $this->rezervacija->id,
                'datum' => $this->rezervacija->datum->format('d.m.Y.'),
                'dan' => $this->rezervacija->naziv_dana,
                'termin' => $this->rezervacija->termin,
                'trajanje' => $this->rezervacija->trajanje,
                'status' => $this->rezervacija->status,
                'teren' => $this->rezervacija->relationLoaded('teren') ? [
                    'id' => $this->rezervacija->teren->id,
                    'naziv' => $this->rezervacija->teren->naziv,
                    'grad' => $this->rezervacija->teren->grad,
                    'adresa' => $this->rezervacija->teren->adresa,
                ] : null,
                'organizator' => $this->rezervacija->relationLoaded('igrac') ? [
                    'id' => $this->rezervacija->igrac->id,
                    'puno_ime' => $this->rezervacija->igrac->puno_ime,
                ] : null,
            ]),
            'ucesnici' => $this->whenLoaded('ucesnici', fn () => $this->ucesnici
                ->where('status', 'prijavljen')
                ->values()
                ->map(fn ($ucesnik) => [
                    'id' => $ucesnik->igrac->id,
                    'puno_ime' => $ucesnik->igrac->puno_ime,
                    'prijavljen_od' => $ucesnik->updated_at?->format('d.m.Y. H:i'),
                ])),
            'ja_sam_prijavljen' => $this->when(
                $korisnik !== null && $this->relationLoaded('ucesnici'),
                fn () => $this->ucesnici->contains(
                    fn ($u) => $u->igrac_id === $korisnik->id && $u->status === 'prijavljen'
                )
            ),
            'created_at' => $this->created_at?->format('d.m.Y. H:i'),
        ];
    }
}
