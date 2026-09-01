<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'ime' => $data['ime'],
                'prezime' => $data['prezime'],
                'email' => $data['email'],
                'password' => $data['password'],
                'type' => $data['type'],
            ]);

            $user->refresh();

            return [
                'user' => $user,
                'token' => $user->createToken('auth_token')->plainTextToken,
            ];
        });
    }

    public function login(array $credentials): array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw new Exception('Pogrešan email ili lozinka.', 401);
        }

        if ($user->banovan) {
            $user->tokens()->delete();

            throw new Exception('Vaš nalog je banovan i ne možete se prijaviti.', 403);
        }

        return [
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
        ];
    }

    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }
}
