<?php

namespace App\Http\Controllers\Vlasnik;

use App\Http\Controllers\Controller;
use App\Http\Requests\RezervacijaStatusRequest;
use App\Http\Requests\VlasnikRezervacijaFilterRequest;
use App\Http\Resources\RezervacijaResource;
use App\Models\Rezervacija;
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

    public function index(VlasnikRezervacijaFilterRequest $request)
    {
        return RezervacijaResource::collection(
            $this->rezervacijaService->getRezervacijeVlasnika($request->validated(), Auth::user())
        );
    }

    public function status(RezervacijaStatusRequest $request, Rezervacija $rezervacija)
    {
        try {
            $rezervacija = $this->rezervacijaManager->promeniStatus($rezervacija, $request->validated()['status']);

            return response()->json([
                'success' => true,
                'message' => $rezervacija->status === 'potvrdjena'
                    ? 'Rezervacija je potvrđena.'
                    : 'Rezervacija je otkazana.',
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
