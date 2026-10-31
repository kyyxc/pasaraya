<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\SellerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [MarketplaceController::class, 'home'])->name('home');
Route::get('/products', [MarketplaceController::class, 'index'])->name('products');
Route::get('/products/{product}', [MarketplaceController::class, 'show'])->name('products.show');
Route::get('/categories', [MarketplaceController::class, 'categories'])->name('categories');

Route::get('/sell', function () {
    return Inertia::render('Sell', [
        'message' => 'Mulai jualan',
    ]);
})->name('sell');

Route::get('/deals', function () {
    return Inertia::render('Deals', [
        'message' => 'Promo hari ini',
    ]);
})->name('deals');

Route::get('/cart', function () {
    return Inertia::render('Cart', [
        'message' => 'Keranjang Anda',
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

Route::middleware(['auth', 'role:seller'])->prefix('seller')->name('seller.')->group(function () {
    Route::get('/dashboard', [SellerController::class, 'dashboard'])->name('dashboard');
    Route::get('/products', [SellerController::class, 'products'])->name('products');
    Route::post('/products', [SellerController::class, 'storeProduct'])->name('products.store');
    Route::put('/products/{product}', [SellerController::class, 'updateProduct'])->name('products.update');
    Route::delete('/products/{product}', [SellerController::class, 'destroyProduct'])->name('products.destroy');
    Route::get('/orders', [SellerController::class, 'orders'])->name('orders');
    Route::get('/chat', [SellerController::class, 'chat'])->name('chat');
    Route::get('/statistics', [SellerController::class, 'statistics'])->name('statistics');
    Route::get('/store-profile', [SellerController::class, 'storeProfile'])->name('store.profile');
    Route::get('/account', [SellerController::class, 'account'])->name('account');
});

Route::get('/profile', function (Request $request) {
    $user = $request->user();

    return Inertia::render('Profile', [
        'message' => 'Selamat datang di profil Anda',
        'user' => $user ? [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'is_active' => (bool) $user->is_active,
            'is_staff' => (bool) $user->is_staff,
            'date_joined' => $user->date_joined?->toISOString(),
        ] : null,
    ]);
})->middleware('auth')->name('profile');
