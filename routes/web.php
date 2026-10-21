<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'message' => 'Welcome to Pasaraya',
    ]);
})->name('home');

Route::get('/products', function () {
    return Inertia::render('Products', [
        'message' => 'Browse products',
    ]);
})->name('products');

Route::get('/categories', function () {
    return Inertia::render('Categories', [
        'message' => 'Explore categories',
    ]);
})->name('categories');

Route::get('/sell', function () {
    return Inertia::render('Sell', [
        'message' => 'Start selling',
    ]);
})->name('sell');

Route::get('/deals', function () {
    return Inertia::render('Deals', [
        'message' => 'Today\'s deals',
    ]);
})->name('deals');

Route::get('/cart', function () {
    return Inertia::render('Cart', [
        'message' => 'Your cart',
    ]);
})->name('cart');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.store');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.store');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

Route::get('/profile', function () {
    return Inertia::render('Profile', [
        'message' => 'Welcome to your profile',
    ]);
})->middleware('auth')->name('profile');
