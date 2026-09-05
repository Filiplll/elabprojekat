<?php

namespace App\Services;

use App\Models\RadnoVreme;
use App\Models\Rezervacija;
use App\Models\Teren;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class RezervacijaService
{
    private const KORAK = 30;

    private const NAJKRACE = 60;

    private const DOZVOLJENI_PRELAZI = [
        'na_cekanju' => ['potvrdjena', 'otkazana'],
        'potvrdjena' => ['otkazana'],
    ];

    public function getMojeRezervacije(array $filters, User $igrac): LengthAwarePaginator
    {
        return $this->primeniFiltere(
            Rezervacija::query()
                ->where('igrac_id', $igrac->id)
                ->with(['teren', 'javniPoziv', 'recenzije' => fn ($q) => $q->where('igrac_id', $igrac->id)]),
            $filters
        );
    }

    public function getRezervacijeVlasnika(array $filters, User $vlasnik): LengthAwarePaginator
    {
        return $this->primeniFiltere(
            Rezervacija::query()
                ->whereHas('teren', fn ($q) => $q->where('vlasnik_id', $vlasnik->id))
                ->with(['teren', 'igrac', 'javniPoziv', 'recenzije' => fn ($q) => $q->where('igrac_id', $vlasnik->id)]),
            $filters
        );
    }

    public function promeniStatus(Rezervacija $rezervacija, string $status): Rezervacija
    {
        $dozvoljeni = self::DOZVOLJENI_PRELAZI[$rezervacija->status] ?? [];

        if (! in_array($status, $dozvoljeni, true)) {
            throw new Exception(
                "Rezervacija u statusu '{$rezervacija->status}' ne može preći u '{$status}'.",
                409
            );
        }

        $rezervacija->update(['status' => $status]);

        return $rezervacija->refresh()->load(['teren', 'igrac']);
    }

    public function kreiraj(Teren $teren, array $data, User $igrac): Rezervacija
    {
        if (! $teren->aktivan) {
            throw new Exception('Teren trenutno nije u ponudi.', 409);
        }

        return DB::transaction(function () use ($teren, $data, $igrac) {
            $this->proveriTermin($teren, $data['datum'], $data['vreme_od'], $data['vreme_do'], null, $igrac);

            $rezervacija = Rezervacija::create([
                'teren_id' => $teren->id,
                'igrac_id' => $igrac->id,
                'datum' => $data['datum'],
                'vreme_od' => $data['vreme_od'],
                'vreme_do' => $data['vreme_do'],
                'cena_ukupno' => $this->izracunajCenu($teren, $data['vreme_od'], $data['vreme_do']),
                'status' => 'na_cekanju',
            ]);

            return $rezervacija->load('teren');
        });
    }

    public function promeniTermin(Rezervacija $rezervacija, array $data): Rezervacija
    {
        $this->proveriDaSeMozeMenjati($rezervacija);

        return DB::transaction(function () use ($rezervacija, $data) {
            $teren = $rezervacija->teren;

            $this->proveriTermin($teren, $data['datum'], $data['vreme_od'], $data['vreme_do'], $rezervacija->id, $rezervacija->igrac);

            $rezervacija->update([
                'datum' => $data['datum'],
                'vreme_od' => $data['vreme_od'],
                'vreme_do' => $data['vreme_do'],
                'cena_ukupno' => $this->izracunajCenu($teren, $data['vreme_od'], $data['vreme_do']),
            ]);

            return $rezervacija->refresh()->load('teren');
        });
    }

    public function otkazi(Rezervacija $rezervacija): Rezervacija
    {
        if ($rezervacija->isOtkazana()) {
            throw new Exception('Rezervacija je već otkazana.', 409);
        }

        $this->proveriDaSeMozeMenjati($rezervacija);

        $rezervacija->update(['status' => 'otkazana']);

        return $rezervacija->refresh()->load('teren');
    }

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

    private function primeniFiltere(Builder $query, array $filters): LengthAwarePaginator
    {
        $query->when(isset($filters['status']), fn ($q) => $q->where('status', $filters['status']));
        $query->when(isset($filters['teren_id']), fn ($q) => $q->where('teren_id', $filters['teren_id']));
        $query->when(isset($filters['igrac_id']), fn ($q) => $q->where('igrac_id', $filters['igrac_id']));
        $query->when(isset($filters['od_datuma']), fn ($q) => $q->where('datum', '>=', $filters['od_datuma']));
        $query->when(isset($filters['do_datuma']), fn ($q) => $q->where('datum', '<=', $filters['do_datuma']));

        $sortable = ['datum', 'created_at'];
        $sortBy = in_array($filters['sort_by'] ?? '', $sortable) ? $filters['sort_by'] : 'datum';
        $order = ($filters['order'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($sortBy, $order)->orderBy('vreme_od', $order)->paginate($filters['per_page'] ?? 10);
    }

    private function proveriDaSeMozeMenjati(Rezervacija $rezervacija): void
    {
        if ($rezervacija->isOdigrana()) {
            throw new Exception('Odigrana rezervacija se više ne može menjati.', 409);
        }

        if ($rezervacija->isOtkazana()) {
            throw new Exception('Otkazana rezervacija se više ne može menjati.', 409);
        }

        if ($rezervacija->jePocela()) {
            throw new Exception('Termin je već počeo, rezervacija se više ne može menjati.', 409);
        }
    }

    private function proveriTermin(Teren $teren, string $datum, string $od, string $do, ?int $ignorisiId, ?User $igrac): void
    {
        $dan = Carbon::parse($datum);
        $radno = $teren->radnoVreme()->where('dan_u_nedelji', $dan->dayOfWeekIso - 1)->first();

        if (! $radno || ! $radno->radi) {
            throw new Exception('Teren tog dana ne radi.', 409);
        }

        $otvara = substr((string) $radno->otvara_u, 0, 5);
        $zatvara = substr((string) $radno->zatvara_u, 0, 5);

        if ($od < $otvara || $do > $zatvara) {
            throw new Exception("Teren tog dana radi od {$otvara} do {$zatvara}.", 409);
        }

        if ($this->uMinutima($od) - $this->uMinutima($otvara) < 0 || ($this->uMinutima($od) - $this->uMinutima($otvara)) % self::KORAK !== 0) {
            throw new Exception("Termin mora počinjati na pola sata računato od otvaranja terena ({$otvara}).", 409);
        }

        $zauzeti = Rezervacija::where('teren_id', $teren->id)
            ->where('datum', $dan->format('Y-m-d'))
            ->neotkazane()
            ->when($ignorisiId, fn ($q) => $q->where('id', '!=', $ignorisiId))
            ->lockForUpdate()
            ->get(['id', 'vreme_od', 'vreme_do']);

        if ($this->preklapaSe($zauzeti, $od, $do)) {
            throw new Exception('Taj termin je već zauzet na ovom terenu.', 409);
        }

        if ($igrac) {
            $svoji = Rezervacija::where('igrac_id', $igrac->id)
                ->where('datum', $dan->format('Y-m-d'))
                ->neotkazane()
                ->when($ignorisiId, fn ($q) => $q->where('id', '!=', $ignorisiId))
                ->get(['id', 'vreme_od', 'vreme_do']);

            if ($this->preklapaSe($svoji, $od, $do)) {
                throw new Exception('Već imaš rezervaciju koja se preklapa sa ovim terminom.', 409);
            }
        }
    }

    private function preklapaSe($rezervacije, string $od, string $do): bool
    {
        return $rezervacije->contains(function ($r) use ($od, $do) {
            $rOd = substr((string) $r->vreme_od, 0, 5);
            $rDo = substr((string) $r->vreme_do, 0, 5);

            return $rOd < $do && $rDo > $od;
        });
    }

    private function izracunajCenu(Teren $teren, string $od, string $do): float
    {
        $sati = ($this->uMinutima($do) - $this->uMinutima($od)) / 60;

        return round((float) $teren->cena_po_satu * $sati, 2);
    }

    private function uMinutima(string $vreme): int
    {
        [$sat, $minut] = explode(':', substr($vreme, 0, 5));

        return ((int) $sat) * 60 + (int) $minut;
    }
}
