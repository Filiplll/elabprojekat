<?php

namespace App\Http\Controllers\Vlasnik;

use App\Http\Controllers\Controller;
use App\Http\Requests\TerenFilterRequest;
use App\Http\Requests\TerenOwnerRequest;
use App\Http\Requests\TerenRequest;
use App\Http\Resources\TerenResource;
use App\Models\Teren;
use App\Services\TerenService;
use Exception;
use Illuminate\Support\Facades\Auth;

class TerenController extends Controller
{
    public function __construct(private TerenService $terenService) {}

    public function index(TerenFilterRequest $request)
    {
        return TerenResource::collection(
            $this->terenService->getAllTereni($request->validated(), Auth::user())
        );
    }

    public function show(TerenOwnerRequest $request, Teren $teren)
    {
        return new TerenResource(
            $this->terenService->getTeren($teren)
        );
    }

    public function store(TerenRequest $request)
    {
        try {
            $teren = $this->terenService->create($request->validated(), Auth::user());

            return response()->json([
                'success' => true,
                'message' => 'Teren je uspešno kreiran.',
                'data' => new TerenResource($teren),
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    public function update(TerenRequest $request, Teren $teren)
    {
        try {
            $teren = $this->terenService->update($teren, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Teren je uspešno izmenjen.',
                'data' => new TerenResource($teren),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    public function destroy(TerenOwnerRequest $request, Teren $teren)
    {
        try {
            $this->terenService->delete($teren);

            return response()->json([
                'success' => true,
                'message' => 'Teren je uspešno obrisan.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }
}
