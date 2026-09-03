<?php

namespace App\Services;

use App\Models\JavniPoziv;
use App\Models\PozivUcesnik;
use App\Models\Rezervacija;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class JavniPozivService
{
    private const VEZE = ['rezervacija.teren', 'rezervacija.igrac', 'ucesnici.igrac'];

    public function getAktivnePozive(array $filters): LengthAwarePaginator
    {
        $query = JavniPoziv::query()->aktivni()->predstojeci()->with(self::VEZE);

        $query->when(isset($filters['grad']), fn ($q) => $q->whereHas(
            'rezervacija.teren',
            fn ($t) => $t->where('grad', 'LIKE', "%{$filters['grad']}%")
        ));

        $query->when(isset($filters['sport_id']), fn ($q) => $q->whereHas(
            'rezervacija.teren.sportovi',
            fn ($s) => $s->where('sportovi.id', $filters['sport_id'])
        ));

        $query->when(isset($filters['teren_id']), fn ($q) => $q->whereHas(
            'rezervacija',
            fn ($r) => $r->where('teren_id', $filters['teren_id'])
        ));

        $query->when(isset($filters['od_datuma']), fn ($q) => $q->whereHas(
            'rezervacija',
            fn ($r) => $r->where('datum', '>=', $filters['od_datuma'])
        ));

        $query->when(isset($filters['do_datuma']), fn ($q) => $q->whereHas(
            'rezervacija',
            fn ($r) => $r->where('datum', '<=', $filters['do_datuma'])
        ));

        $order = ($filters['order'] ?? 'asc') === 'desc' ? 'desc' : 'asc';

        return $query->orderBy('created_at', $order)->paginate($filters['per_page'] ?? 10);
    }

    public function getPoziv(JavniPoziv $poziv): JavniPoziv
    {
        return $poziv->load(self::VEZE);
    }

    public function kreiraj(Rezervacija $rezervacija, array $data): JavniPoziv
    {
        if ($rezervacija->isOtkazana() || $rezervacija->isOdigrana()) {
            throw new Exception('Poziv se pravi samo za rezervaciju koja tek predstoji.', 409);
        }

        if ($rezervacija->jePocela()) {
            throw new Exception('Termin je već počeo, poziv više nema smisla.', 409);
        }

        if ($rezervacija->javniPoziv()->exists()) {
            throw new Exception('Ova rezervacija već ima javni poziv.', 409);
        }

        $poziv = JavniPoziv::create([
            'rezervacija_id' => $rezervacija->id,
            'broj_slobodnih_mesta' => $data['broj_slobodnih_mesta'],
            'opis' => $data['opis'] ?? null,
            'aktivan' => true,
        ]);

        return $this->getPoziv($poziv);
    }

    public function izmeni(JavniPoziv $poziv, array $data): JavniPoziv
    {
        if (! $poziv->aktivan) {
            throw new Exception('Otkazan poziv se više ne menja.', 409);
        }

        if (array_key_exists('broj_slobodnih_mesta', $data)) {
            $prijavljenih = $poziv->ucesnici()->prijavljeni()->count();

            if ($data['broj_slobodnih_mesta'] < $prijavljenih) {
                throw new Exception(
                    "Već je prijavljeno {$prijavljenih} igrača, broj mesta ne može biti manji od toga.",
                    409
                );
            }
        }

        $poziv->update(array_intersect_key($data, array_flip(['broj_slobodnih_mesta', 'opis'])));

        return $this->getPoziv($poziv->refresh());
    }

    public function otkazi(JavniPoziv $poziv): JavniPoziv
    {
        if (! $poziv->aktivan) {
            throw new Exception('Poziv je već otkazan.', 409);
        }

        $poziv->update(['aktivan' => false]);

        return $this->getPoziv($poziv->refresh());
    }

    public function pridruzi(JavniPoziv $poziv, User $igrac): PozivUcesnik
    {
        if ($poziv->pripada($igrac)) {
            throw new Exception('Ne možeš se prijaviti na sopstveni poziv.', 409);
        }

        if (! $poziv->jeOtvoren()) {
            throw new Exception('Poziv više nije otvoren za prijave.', 409);
        }

        return DB::transaction(function () use ($poziv, $igrac) {
            $prijavljenih = $poziv->ucesnici()->prijavljeni()->lockForUpdate()->count();

            $vec = $poziv->ucesnici()->where('igrac_id', $igrac->id)->first();

            if ($vec && $vec->status === 'prijavljen') {
                throw new Exception('Već si prijavljen na ovaj poziv.', 409);
            }

            if ($prijavljenih >= $poziv->broj_slobodnih_mesta) {
                throw new Exception('Nema više slobodnih mesta na ovom pozivu.', 409);
            }

            if ($vec) {
                $vec->update(['status' => 'prijavljen']);

                return $vec->refresh()->load('igrac');
            }

            return PozivUcesnik::create([
                'poziv_id' => $poziv->id,
                'igrac_id' => $igrac->id,
                'status' => 'prijavljen',
            ])->load('igrac');
        });
    }

    public function odjavi(JavniPoziv $poziv, User $igrac): PozivUcesnik
    {
        $ucesnik = $poziv->ucesnici()->where('igrac_id', $igrac->id)->first();

        if (! $ucesnik || $ucesnik->status !== 'prijavljen') {
            throw new Exception('Nisi prijavljen na ovaj poziv.', 409);
        }

        if ($poziv->rezervacija?->jePocela()) {
            throw new Exception('Termin je već počeo, prijava se više ne otkazuje.', 409);
        }

        $ucesnik->update(['status' => 'otkazan']);

        return $ucesnik->refresh()->load('igrac');
    }
}
