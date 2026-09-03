<?php

namespace App\Http\Controllers;

use App\Http\Requests\RezervacijaFilterRequest;
use App\Http\Requests\RezervacijaOtkaziRequest;
use App\Http\Requests\RezervacijaRequest;
use App\Http\Requests\RezervacijaTerminRequest;
use App\Http\Requests\SlobodniTerminiRequest;
use App\Http\Resources\RezervacijaResource;
use App\Models\Rezervacija;
use App\Models\Teren;
use App\Services\RezervacijaManager;
use App\Services\RezervacijaService;
use Exception;
use Illuminate\Support\Facades\Auth;

class RezervacijaController extends Controller
{
    public function __construct(
        private RezervacijaService $rezervacijaService,
        private RezervacijaManager $rezervacijaManager
    ) {}

    public function index(RezervacijaFilterRequest $request)
    {
        return RezervacijaResource::collection(
            $this->rezervacijaService->getMojeRezervacije($request->validated(), Auth::user())
        );
    }

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

    public function store(RezervacijaRequest $request, Teren $teren)
    {
        try {
            $rezervacija = $this->rezervacijaManager->rezervisi($teren, $request->validated(), Auth::user());

            return response()->json([
                'success' => true,
                'message' => 'Termin je rezervisan i čeka potvrdu vlasnika terena.',
                'data' => new RezervacijaResource($rezervacija),
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    public function update(RezervacijaTerminRequest $request, Rezervacija $rezervacija)
    {
        try {
            $rezervacija = $this->rezervacijaManager->promeniTermin($rezervacija, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Termin rezervacije je promenjen.',
                'data' => new RezervacijaResource($rezervacija),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    public function otkazi(RezervacijaOtkaziRequest $request, Rezervacija $rezervacija)
    {
        try {
            $rezervacija = $this->rezervacijaManager->otkazi($rezervacija);

            return response()->json([
                'success' => true,
                'message' => 'Rezervacija je otkazana.',
                'data' => new RezervacijaResource($rezervacija),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }
}
