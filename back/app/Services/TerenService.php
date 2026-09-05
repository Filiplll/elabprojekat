<?php

namespace App\Services;

use App\Models\Teren;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class TerenService
{
    public function getAktivneTerene(array $filters): LengthAwarePaginator
    {
        return $this->primeniFiltere(
            Teren::query()->aktivni()->with(['sportovi', 'vlasnik', 'radnoVreme']),
            $filters
        );
    }

    public function getAktivanTeren(Teren $teren): Teren
    {
        if (! $teren->aktivan) {
            throw new Exception('Teren trenutno nije u ponudi.', 404);
        }

        return $teren->load(['sportovi', 'vlasnik', 'radnoVreme']);
    }

    public function getAllTereni(array $filters, User $vlasnik): LengthAwarePaginator
    {
        return $this->primeniFiltere(
            Teren::query()->where('vlasnik_id', $vlasnik->id)->with(['sportovi', 'radnoVreme'])->withCount('rezervacije'),
            $filters
        );
    }

    public function getTeren(Teren $teren): Teren
    {
        return $teren->load(['sportovi', 'radnoVreme'])->loadCount('rezervacije');
    }

    public function create(array $data, User $vlasnik): Teren
    {
        return DB::transaction(function () use ($data, $vlasnik) {
            $teren = Teren::create([
                'vlasnik_id' => $vlasnik->id,
                'naziv' => $data['naziv'],
                'grad' => $data['grad'],
                'adresa' => $data['adresa'],
                'cena_po_satu' => $data['cena_po_satu'],
                'natkriven' => $data['natkriven'] ?? false,
                'aktivan' => $data['aktivan'] ?? true,
                'opis' => $data['opis'] ?? null,
            ]);

            if (array_key_exists('sportovi', $data)) {
                $teren->sportovi()->sync($data['sportovi']);
            }

            if (array_key_exists('radno_vreme', $data)) {
                $this->sinhronizujRadnoVreme($teren, $data['radno_vreme']);
            }

            return $this->getTeren($teren->refresh());
        });
    }

    public function update(Teren $teren, array $data): Teren
    {
        return DB::transaction(function () use ($teren, $data) {
            $teren->update([
                'naziv' => $data['naziv'],
                'grad' => $data['grad'],
                'adresa' => $data['adresa'],
                'cena_po_satu' => $data['cena_po_satu'],
                'natkriven' => $data['natkriven'] ?? $teren->natkriven,
                'aktivan' => $data['aktivan'] ?? $teren->aktivan,
                'opis' => array_key_exists('opis', $data) ? $data['opis'] : $teren->opis,
            ]);

            if (array_key_exists('sportovi', $data)) {
                $teren->sportovi()->sync($data['sportovi']);
            }

            if (array_key_exists('radno_vreme', $data)) {
                $this->sinhronizujRadnoVreme($teren, $data['radno_vreme']);
            }

            return $this->getTeren($teren->refresh());
        });
    }

    public function delete(Teren $teren): void
    {
        $vezane = $teren->rezervacije()->where('status', '!=', 'otkazana')->count();

        if ($vezane > 0) {
            throw new Exception(
                "Teren ima {$vezane} rezervacija koje nisu otkazane, pa se ne može obrisati. Postavi ga na aktivan = false da ga skloniš iz ponude.",
                409
            );
        }

        $teren->delete();
    }

    private function sinhronizujRadnoVreme(Teren $teren, array $dani): void
    {
        foreach ($dani as $dan) {
            $radi = filter_var($dan['radi'], FILTER_VALIDATE_BOOLEAN);

            $teren->radnoVreme()->updateOrCreate(
                ['dan_u_nedelji' => $dan['dan_u_nedelji']],
                [
                    'radi' => $radi,
                    'otvara_u' => $radi ? $dan['otvara_u'] : null,
                    'zatvara_u' => $radi ? $dan['zatvara_u'] : null,
                ]
            );
        }
    }

    private function primeniFiltere(Builder $query, array $filters): LengthAwarePaginator
    {
        $query->when(isset($filters['naziv']), fn ($q) => $q->where('naziv', 'LIKE', "%{$filters['naziv']}%"));
        $query->when(isset($filters['grad']), fn ($q) => $q->where('grad', 'LIKE', "%{$filters['grad']}%"));
        $query->when(isset($filters['max_cena']), fn ($q) => $q->where('cena_po_satu', '<=', $filters['max_cena']));
        $query->when(isset($filters['vlasnik_id']), fn ($q) => $q->where('vlasnik_id', $filters['vlasnik_id']));

        $query->when(isset($filters['aktivan']), fn ($q) => $q->where(
            'aktivan',
            filter_var($filters['aktivan'], FILTER_VALIDATE_BOOLEAN)
        ));

        $query->when(isset($filters['natkriven']), fn ($q) => $q->where(
            'natkriven',
            filter_var($filters['natkriven'], FILTER_VALIDATE_BOOLEAN)
        ));

        $query->when(isset($filters['sport_id']), fn ($q) => $q->whereHas(
            'sportovi',
            fn ($s) => $s->where('sportovi.id', $filters['sport_id'])
        ));

        $sortable = ['naziv', 'grad', 'cena_po_satu', 'created_at'];
        $sortBy = in_array($filters['sort_by'] ?? '', $sortable) ? $filters['sort_by'] : 'naziv';
        $order = ($filters['order'] ?? 'asc') === 'desc' ? 'desc' : 'asc';

        return $query->orderBy($sortBy, $order)->paginate($filters['per_page'] ?? 10);
    }
}
