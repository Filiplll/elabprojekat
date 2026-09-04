<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecenzijaFilterRequest;
use App\Http\Requests\RecenzijaIzmenaRequest;
use App\Http\Requests\RecenzijaRequest;
use App\Http\Resources\RecenzijaResource;
use App\Models\Recenzija;
use App\Models\Rezervacija;
use App\Models\Teren;
use App\Services\RecenzijaService;
use Exception;
use Illuminate\Support\Facades\Auth;

class RecenzijaController extends Controller
{
    public function __construct(private RecenzijaService $recenzijaService) {}

    public function zaTeren(RecenzijaFilterRequest $request, Teren $teren)
    {
        return RecenzijaResource::collection(
            $this->recenzijaService->getZaTeren($teren, $request->validated())
        );
    }

    public function store(RecenzijaRequest $request, Rezervacija $rezervacija)
    {
        try {
            $recenzija = $this->recenzijaService->kreiraj($rezervacija, $request->validated(), Auth::user());

            return response()->json([
                'success' => true,
                'message' => 'Recenzija je poslata i čeka odobrenje administratora.',
                'data' => new RecenzijaResource($recenzija),
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    public function update(RecenzijaIzmenaRequest $request, Recenzija $recenzija)
    {
        try {
            $recenzija = $this->recenzijaService->izmeni($recenzija, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Recenzija je izmenjena i ponovo čeka odobrenje.',
                'data' => new RecenzijaResource($recenzija),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }
}
