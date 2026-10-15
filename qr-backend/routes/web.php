<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ScanController;

Route::get('/', function () {
    return view('welcome');
});

// Dynamic QR short-link tracking and redirect engine
Route::get('/s/{uuid}', [ScanController::class, 'redirect']);