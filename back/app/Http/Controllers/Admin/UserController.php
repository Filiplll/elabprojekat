<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserBanRequest;
use App\Http\Requests\UserFilterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Exception;

class UserController extends Controller
{
    public function __construct(private UserService $userService) {}

    public function index(UserFilterRequest $request)
    {
        return UserResource::collection(
            $this->userService->getAllUsers($request->validated())
        );
    }

    public function ban(UserBanRequest $request, User $user)
    {
        try {
            $user = $this->userService->setBan($user, $request->zeljeniStatus());

            return response()->json([
                'success' => true,
                'message' => $user->banovan ? 'Korisnik je banovan.' : 'Ban je uklonjen.',
                'data' => new UserResource($user),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }
}
