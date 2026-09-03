<?php

namespace App\Http\Controllers;

use App\Http\Requests\JavniPozivFilterRequest;
use App\Http\Requests\JavniPozivIzmenaRequest;
use App\Http\Requests\JavniPozivRequest;
use App\Http\Requests\JavniPozivVlasnikRequest;
use App\Http\Resources\JavniPozivResource;
use App\Models\JavniPoziv;
use App\Models\Rezervacija;
use App\Services\JavniPozivService;
use Exception;

class JavniPozivController extends Controller
{
    public function __construct(private JavniPozivService $javniPozivService) {}

    public function index(JavniPozivFilterRequest $request)
    {
        return JavniPozivResource::collection(
            $this->javniPozivService->getAktivnePozive($request->validated())
        );
    }

    public function show(JavniPozivFilterRequest $request, JavniPoziv $poziv)
    {
        return new JavniPozivResource(
            $this->javniPozivService->getPoziv($poziv)
        );
    }

    public function store(JavniPozivRequest $request, Rezervacija $rezervacija)
    {
        try {
            $poziv = $this->javniPozivService->kreiraj($rezervacija, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Javni poziv je objavljen.',
                'data' => new JavniPozivResource($poziv),
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    public function update(JavniPozivIzmenaRequest $request, JavniPoziv $poziv)
    {
        try {
            $poziv = $this->javniPozivService->izmeni($poziv, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Javni poziv je izmenjen.',
                'data' => new JavniPozivResource($poziv),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    public function otkazi(JavniPozivVlasnikRequest $request, JavniPoziv $poziv)
    {
        try {
            $poziv = $this->javniPozivService->otkazi($poziv);

            return response()->json([
                'success' => true,
                'message' => 'Javni poziv je otkazan.',
                'data' => new JavniPozivResource($poziv),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }
}
