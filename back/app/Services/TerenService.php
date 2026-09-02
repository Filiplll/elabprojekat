<?php

namespace App\Services;

use App\Models\Teren;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

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
