<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\QrCodeController;
use App\Http\Controllers\AdminController; // Make sure this matches your file's namespace

// Public Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Admin-Only Routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
});
// Protected Admin Routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);
});

// Authenticated User Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Full CRUD and Analytics routes for QR codes
    Route::get('/qrcodes', [QrCodeController::class, 'index']);
    Route::post('/qrcodes', [QrCodeController::class, 'store']);
    Route::get('/qrcodes/{id}', [QrCodeController::class, 'show']);
    Route::put('/qrcodes/{id}', [QrCodeController::class, 'update']);
    Route::delete('/qrcodes/{id}', [QrCodeController::class, 'destroy']);
    Route::get('/qrcodes/{id}/analytics', [QrCodeController::class, 'analytics']);
});