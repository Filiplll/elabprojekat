<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RezervacijaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'datum' => $this->datum->format('d.m.Y.'),
            'dan' => $this->naziv_dana,
            'vreme_od' => substr((string) $this->vreme_od, 0, 5),
            'vreme_do' => substr((string) $this->vreme_do, 0, 5),
            'termin' => $this->termin,
            'trajanje' => $this->trajanje,
            'cena_formatirana' => $this->formatirana_cena,
            'cena_ukupno' => (float) $this->cena_ukupno,
            'status' => $this->status,
            'moze_se_menjati' => $this->mozeSeMenjati(),
            'ima_javni_poziv' => $this->imaJavniPoziv(),
            'moja_recenzija' => $this->mojaRecenzija($request),
            'teren' => $this->whenLoaded('teren', fn () => [
                'id' => $this->teren->id,
                'naziv' => $this->teren->naziv,
                'grad' => $this->teren->grad,
                'adresa' => $this->teren->adresa,
            ]),
            'igrac' => $this->whenLoaded('igrac', fn () => [
                'id' => $this->igrac->id,
                'puno_ime' => $this->igrac->puno_ime,
                'email' => $this->igrac->email,
            ]),
            'created_at' => $this->created_at?->format('d.m.Y. H:i'),
        ];
    }

    private function mojaRecenzija(Request $request): ?RecenzijaResource
    {
        $recenzija = $this->recenzijaOd($request->user());

        return $recenzija ? new RecenzijaResource($recenzija) : null;
    }
}
