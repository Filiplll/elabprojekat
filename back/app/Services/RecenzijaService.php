<?php

namespace App\Services;

use App\Models\Recenzija;
use App\Models\Rezervacija;
use App\Models\Teren;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class RecenzijaService
{
    public function getZaTeren(Teren $teren, array $filters): LengthAwarePaginator
    {
        return $this->primeniFiltere(
            Recenzija::query()
                ->odobrene()
                ->whereHas('rezervacija', fn ($q) => $q->where('teren_id', $teren->id))
                ->with(['igrac', 'rezervacija.teren']),
            $filters
        );
    }

    public function kreiraj(Rezervacija $rezervacija, array $data, User $igrac): Recenzija
    {
        if (! $rezervacija->isOdigrana()) {
            throw new Exception('Recenzija se ostavlja tek kada je termin odigran.', 409);
        }

        $vec = Recenzija::where('rezervacija_id', $rezervacija->id)
            ->where('igrac_id', $igrac->id)
            ->exists();

        if ($vec) {
            throw new Exception('Već si ostavio recenziju za ovaj termin.', 409);
        }

        $recenzija = Recenzija::create([
            'rezervacija_id' => $rezervacija->id,
            'igrac_id' => $igrac->id,
            'ocena' => $data['ocena'],
            'komentar' => $data['komentar'] ?? null,
            'status' => 'na_cekanju',
        ]);

        return $recenzija->load(['igrac', 'rezervacija.teren']);
    }

    public function izmeni(Recenzija $recenzija, array $data): Recenzija
    {
        $recenzija->update([
            'ocena' => $data['ocena'],
            'komentar' => array_key_exists('komentar', $data) ? $data['komentar'] : $recenzija->komentar,
            'status' => 'na_cekanju',
        ]);

        return $recenzija->refresh()->load(['igrac', 'rezervacija.teren']);
    }

    private function primeniFiltere(Builder $query, array $filters): LengthAwarePaginator
    {
        $query->when(isset($filters['ocena']), fn ($q) => $q->where('ocena', $filters['ocena']));
        $query->when(isset($filters['min_ocena']), fn ($q) => $q->where('ocena', '>=', $filters['min_ocena']));

        $sortable = ['ocena', 'created_at'];
        $sortBy = in_array($filters['sort_by'] ?? '', $sortable) ? $filters['sort_by'] : 'created_at';
        $order = ($filters['order'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($sortBy, $order)->paginate($filters['per_page'] ?? 10);
    }
}
