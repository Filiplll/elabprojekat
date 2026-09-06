<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminTerenFilterRequest;
use App\Http\Resources\TerenResource;
use App\Services\TerenService;

class TerenController extends Controller
{
    public function __construct(private TerenService $terenService) {}

    public function index(AdminTerenFilterRequest $request)
    {
        return TerenResource::collection(
            $this->terenService->getSveTerene($request->validated())
        );
    }
}
