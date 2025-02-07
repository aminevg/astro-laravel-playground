<?php

use App\Http\Controllers\ProfileController;
use App\Mighty\Mighty;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Mighty::render('pages/index', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('bladeWelcome', function () {
    return view('welcome');
});

if (app()->environment('local')) {
    // required for Astro error overlay to work correctly
    Route::get('/@vite/client', function () {
        return redirect('http://localhost:9999/@vite/client');
    });
}

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Mighty::render('pages/dashboard', ['user' => auth()->user()]);
    })->middleware('verified');
    Route::get("/profile", [ProfileController::class, 'edit']);
    Route::patch("/profile", [ProfileController::class, 'update']);
    Route::delete("/profile", [ProfileController::class, 'destroy']);
});

require __DIR__.'/auth.php';
