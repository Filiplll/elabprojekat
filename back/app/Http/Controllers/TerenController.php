<?php

namespace App\Http\Controllers;

use App\Http\Requests\TerenPretragaRequest;
use App\Http\Resources\TerenResource;
use App\Services\TerenService;

class TerenController extends Controller
{
    public function __construct(private TerenService $terenService) {}

    public function index(TerenPretragaRequest $request)
    {
        return TerenResource::collection(
            $this->terenService->getAktivneTerene($request->validated())
        );
    }
}
