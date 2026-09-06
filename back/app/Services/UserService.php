<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    public function getAllUsers(array $filters): LengthAwarePaginator
    {
        $query = User::query()
            ->where('type', '!=', 'admin')
            ->withCount(['tereni', 'rezervacije', 'recenzije']);

        $query->when(isset($filters['pretraga']), function ($q) use ($filters) {
            $pojam = $filters['pretraga'];

            $q->where(fn ($w) => $w->where('ime', 'LIKE', "%{$pojam}%")
                ->orWhere('prezime', 'LIKE', "%{$pojam}%")
                ->orWhere('email', 'LIKE', "%{$pojam}%"));
        });

        $query->when(isset($filters['type']), fn ($q) => $q->where('type', $filters['type']));

        $query->when(isset($filters['banovan']), fn ($q) => $q->where(
            'banovan',
            filter_var($filters['banovan'], FILTER_VALIDATE_BOOLEAN)
        ));

        $sortable = ['ime', 'prezime', 'email', 'created_at'];
        $sortBy = in_array($filters['sort_by'] ?? '', $sortable) ? $filters['sort_by'] : 'prezime';
        $order = ($filters['order'] ?? 'asc') === 'desc' ? 'desc' : 'asc';

        return $query->orderBy($sortBy, $order)->paginate($filters['per_page'] ?? 10);
    }

    public function setBan(User $user, ?bool $banovan = null): User
    {
        if ($user->isAdmin()) {
            throw new Exception('Admin nalog ne može biti banovan.', 403);
        }

        $user->banovan = $banovan ?? ! $user->banovan;
        $user->save();

        if ($user->banovan) {
            $user->tokens()->delete();
        }

        return $user->loadCount(['tereni', 'rezervacije', 'recenzije']);
    }
}
