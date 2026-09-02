<?php

namespace App\Http\Controllers;

use App\Http\Requests\SlobodniTerminiRequest;
use App\Models\Teren;
use App\Services\RezervacijaService;

class RezervacijaController extends Controller
{
    public function __construct(private RezervacijaService $rezervacijaService) {}

    public function slobodniTermini(SlobodniTerminiRequest $request, Teren $teren)
    {
        return response()->json([
            'success' => true,
            'data' => $this->rezervacijaService->slobodniTermini(
                $teren,
                $request->validated()['datum'],
                $request->trajanje()
            ),
        ]);
    }
}
