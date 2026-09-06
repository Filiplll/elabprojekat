<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminRecenzijaFilterRequest;
use App\Http\Requests\RecenzijaStatusRequest;
use App\Http\Resources\RecenzijaResource;
use App\Models\Recenzija;
use App\Services\RecenzijaService;
use Exception;

class RecenzijaController extends Controller
{
    public function __construct(private RecenzijaService $recenzijaService) {}

    public function index(AdminRecenzijaFilterRequest $request)
    {
        return RecenzijaResource::collection(
            $this->recenzijaService->getSveRecenzije($request->validated())
        );
    }

    public function status(RecenzijaStatusRequest $request, Recenzija $recenzija)
    {
        try {
            $recenzija = $this->recenzijaService->promeniStatus($recenzija, $request->validated()['status']);

            return response()->json([
                'success' => true,
                'message' => $recenzija->status === 'odobrena'
                    ? 'Recenzija je odobrena i vidljiva je uz teren.'
                    : 'Recenzija je odbijena.',
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
