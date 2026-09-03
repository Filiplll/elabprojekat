<?php

namespace App\Http\Controllers;

use App\Http\Requests\PridruzivanjeRequest;
use App\Http\Resources\JavniPozivResource;
use App\Models\JavniPoziv;
use App\Services\JavniPozivService;
use Exception;
use Illuminate\Support\Facades\Auth;

class PozivUcesnikController extends Controller
{
    public function __construct(private JavniPozivService $javniPozivService) {}

    public function store(PridruzivanjeRequest $request, JavniPoziv $poziv)
    {
        try {
            $this->javniPozivService->pridruzi($poziv, Auth::user());

            return response()->json([
                'success' => true,
                'message' => 'Prijavljen si na poziv.',
                'data' => new JavniPozivResource($this->javniPozivService->getPoziv($poziv->refresh())),
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    public function destroy(PridruzivanjeRequest $request, JavniPoziv $poziv)
    {
        try {
            $this->javniPozivService->odjavi($poziv, Auth::user());

            return response()->json([
                'success' => true,
                'message' => 'Prijava je otkazana.',
                'data' => new JavniPozivResource($this->javniPozivService->getPoziv($poziv->refresh())),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }
}
