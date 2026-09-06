<?php

namespace App\Services;

use App\Models\Sport;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SportService
{
    public function getAllSportovi(array $filters): LengthAwarePaginator
    {
        $query = Sport::query()->withCount('tereni');

        $query->when(isset($filters['naziv']), fn ($q) => $q->where('naziv', 'LIKE', "%{$filters['naziv']}%"));

        $sortable = ['naziv', 'created_at'];
        $sortBy = in_array($filters['sort_by'] ?? '', $sortable) ? $filters['sort_by'] : 'naziv';
        $order = ($filters['order'] ?? 'asc') === 'desc' ? 'desc' : 'asc';

        return $query->orderBy($sortBy, $order)->paginate($filters['per_page'] ?? 10);
    }

    public function create(array $data): Sport
    {
        return Sport::create($data)->loadCount('tereni');
    }

    public function update(Sport $sport, array $data): Sport
    {
        $sport->update($data);

        return $sport->refresh()->loadCount('tereni');
    }

    public function delete(Sport $sport): void
    {
        $brojTerena = $sport->tereni()->count();

        if ($brojTerena > 0) {
            throw new Exception("Sport je dodeljen na {$brojTerena} terena i zato se ne može obrisati.", 409);
        }

        $sport->delete();
    }
}
