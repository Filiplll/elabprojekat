<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\JavniPozivController;
use App\Http\Controllers\PozivUcesnikController;
use App\Http\Controllers\RecenzijaController;
use App\Http\Controllers\RezervacijaController;
use App\Http\Controllers\TerenController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/tereni', [TerenController::class, 'index']);
    Route::get('/tereni/{teren}', [TerenController::class, 'show']);
    Route::get('/tereni/{teren}/slobodni-termini', [RezervacijaController::class, 'slobodniTermini']);

    Route::get('/moje-rezervacije', [RezervacijaController::class, 'index']);
    Route::post('/tereni/{teren}/rezervacije', [RezervacijaController::class, 'store']);
    Route::patch('/rezervacije/{rezervacija}', [RezervacijaController::class, 'update']);
    Route::patch('/rezervacije/{rezervacija}/otkazi', [RezervacijaController::class, 'otkazi']);

    Route::get('/pozivi', [JavniPozivController::class, 'index']);
    Route::get('/pozivi/{poziv}', [JavniPozivController::class, 'show']);
    Route::post('/rezervacije/{rezervacija}/poziv', [JavniPozivController::class, 'store']);
    Route::patch('/pozivi/{poziv}', [JavniPozivController::class, 'update']);
    Route::patch('/pozivi/{poziv}/otkazi', [JavniPozivController::class, 'otkazi']);
    Route::post('/pozivi/{poziv}/pridruzi', [PozivUcesnikController::class, 'store']);
    Route::delete('/pozivi/{poziv}/pridruzi', [PozivUcesnikController::class, 'destroy']);

    Route::get('/tereni/{teren}/recenzije', [RecenzijaController::class, 'zaTeren']);
    Route::post('/rezervacije/{rezervacija}/recenzija', [RecenzijaController::class, 'store']);
    Route::patch('/recenzije/{recenzija}', [RecenzijaController::class, 'update']);
});
