<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SportDeleteRequest;
use App\Http\Requests\SportFilterRequest;
use App\Http\Requests\SportRequest;
use App\Http\Resources\SportResource;
use App\Models\Sport;
use App\Services\SportService;
use Exception;

class SportController extends Controller
{
    public function __construct(private SportService $sportService) {}

    public function index(SportFilterRequest $request)
    {
        return SportResource::collection(
            $this->sportService->getAllSportovi($request->validated())
        );
    }

    public function store(SportRequest $request)
    {
        try {
            $sport = $this->sportService->create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Sport je uspešno kreiran.',
                'data' => new SportResource($sport),
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    public function update(SportRequest $request, Sport $sport)
    {
        try {
            $sport = $this->sportService->update($sport, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Sport je uspešno izmenjen.',
                'data' => new SportResource($sport),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    public function destroy(SportDeleteRequest $request, Sport $sport)
    {
        try {
            $this->sportService->delete($sport);

            return response()->json([
                'success' => true,
                'message' => 'Sport je uspešno obrisan.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }
}
