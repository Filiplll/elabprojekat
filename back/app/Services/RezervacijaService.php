<?php

namespace App\Services;

use App\Models\RadnoVreme;
use App\Models\Teren;
use Carbon\Carbon;

class RezervacijaService
{
    private const KORAK = 30;

    public function slobodniTermini(Teren $teren, string $datum, int $trajanje): array
    {
        $dan = Carbon::parse($datum);
        $indeksDana = $dan->dayOfWeekIso - 1;

        $osnova = [
            'datum' => $dan->format('d.m.Y.'),
            'dan' => RadnoVreme::nazivDana($indeksDana),
            'trajanje' => $trajanje,
        ];

        $radno = $teren->radnoVreme()->where('dan_u_nedelji', $indeksDana)->first();

        if (! $teren->aktivan || ! $radno || ! $radno->radi) {
            return $osnova + ['radi' => false, 'radno_vreme' => null, 'termini' => []];
        }

        $otvara = Carbon::parse($datum . ' ' . $radno->otvara_u);
        $zatvara = Carbon::parse($datum . ' ' . $radno->zatvara_u);

        $zauzeti = $teren->rezervacije()
            ->where('datum', $dan->format('Y-m-d'))
            ->neotkazane()
            ->get(['vreme_od', 'vreme_do'])
            ->map(fn ($r) => [
                Carbon::parse($datum . ' ' . $r->vreme_od),
                Carbon::parse($datum . ' ' . $r->vreme_do),
            ]);

        $termini = [];

        for ($pocetak = $otvara->copy(); $pocetak->copy()->addMinutes($trajanje)->lessThanOrEqualTo($zatvara); $pocetak->addMinutes(self::KORAK)) {
            $kraj = $pocetak->copy()->addMinutes($trajanje);

            $razlog = null;

            if ($pocetak->isPast()) {
                $razlog = 'proslo';
            } elseif ($zauzeti->contains(fn ($z) => $pocetak->lessThan($z[1]) && $kraj->greaterThan($z[0]))) {
                $razlog = 'zauzeto';
            }

            $termini[] = [
                'vreme_od' => $pocetak->format('H:i'),
                'vreme_do' => $kraj->format('H:i'),
                'slobodno' => $razlog === null,
                'razlog' => $razlog,
            ];
        }

        return $osnova + [
            'radi' => true,
            'radno_vreme' => $radno->radno_vreme,
            'termini' => $termini,
        ];
    }
}
