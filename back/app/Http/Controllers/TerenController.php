<?php

namespace App\Http\Controllers;

use App\Http\Requests\TerenPretragaRequest;
use App\Http\Resources\TerenResource;
use App\Models\Teren;
use App\Services\TerenService;
use Exception;

class TerenController extends Controller
{
    public function __construct(private TerenService $terenService) {}

    public function index(TerenPretragaRequest $request)
    {
        return TerenResource::collection(
            $this->terenService->getAktivneTerene($request->validated())
        );
    }

    public function show(Teren $teren)
    {
        try {
            return new TerenResource(
                $this->terenService->getAktivanTeren($teren)
            );
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }
}
