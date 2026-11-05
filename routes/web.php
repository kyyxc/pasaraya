<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\SellerController;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('redirect.non.buyer')->group(function () {
    Route::get('/', [MarketplaceController::class, 'home'])->name('home');
    Route::get('/products', [MarketplaceController::class, 'index'])->name('products');
    Route::get('/products/{product}', [MarketplaceController::class, 'show'])->name('products.show');
    Route::get('/stores/{store:slug}', [MarketplaceController::class, 'store'])->name('stores.show');
    Route::get('/categories', [MarketplaceController::class, 'categories'])->name('categories');
    Route::get('/sell', function () {
        return Inertia::render('Sell', [
            'message' => 'Mulai jualan',
        ]);
    })->name('sell');

    Route::get('/deals', [MarketplaceController::class, 'deals'])->name('deals');

    Route::get('/cart', function () {
        return Inertia::render('Cart', [
            'message' => 'Keranjang Anda',
        ]);
    })->name('cart');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.store');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.store');
    Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
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

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/products', [AdminController::class, 'products'])->name('products');
    Route::post('/products', [AdminController::class, 'storeProduct'])->name('products.store');
    Route::put('/products/{product}', [AdminController::class, 'updateProduct'])->name('products.update');
    Route::delete('/products/{product}', [AdminController::class, 'destroyProduct'])->name('products.destroy');
    Route::get('/stores', [AdminController::class, 'stores'])->name('stores');
    Route::patch('/stores/{store}/status', [AdminController::class, 'updateStoreStatus'])->name('stores.updateStatus');
    Route::delete('/stores/{store}', [AdminController::class, 'destroyStore'])->name('stores.destroy');
    Route::get('/orders', [AdminController::class, 'orders'])->name('orders');
    Route::patch('/orders/{order}/status', [AdminController::class, 'updateOrderStatus'])->name('orders.updateStatus');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/revenue', [AdminController::class, 'revenue'])->name('revenue');
    Route::get('/categories', [AdminController::class, 'categories'])->name('categories');
    Route::post('/categories', [AdminController::class, 'storeCategory'])->name('categories.store');
    Route::put('/categories/{category}', [AdminController::class, 'updateCategory'])->name('categories.update');
    Route::delete('/categories/{category}', [AdminController::class, 'destroyCategory'])->name('categories.destroy');
    Route::get('/reviews', [AdminController::class, 'reviews'])->name('reviews');
    Route::get('/promotions', [AdminController::class, 'promotions'])->name('promotions');
    Route::post('/promotions', [AdminController::class, 'storePromotion'])->name('promotions.store');
    Route::put('/promotions/{promotion}', [AdminController::class, 'updatePromotion'])->name('promotions.update');
    Route::delete('/promotions/{promotion}', [AdminController::class, 'destroyPromotion'])->name('promotions.destroy');
    Route::get('/notifications', [AdminController::class, 'notifications'])->name('notifications');
    Route::post('/notifications', [AdminController::class, 'storeNotification'])->name('notifications.store');
    Route::get('/reports', [AdminController::class, 'reports'])->name('reports');
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
});

Route::middleware(['auth', 'redirect.non.buyer'])->group(function () {
    Route::get('/chat', [MarketplaceController::class, 'chat'])->name('chat');

    Route::get('/profile', function (Request $request) {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $notifications = Notification::forUser($user)
            ->map(fn (Notification $notification) => [
                'id' => $notification->id,
                'title' => $notification->title,
                'message' => $notification->message,
                'type' => $notification->type,
                'target' => $notification->reference_type ?? 'all',
                'is_read' => (bool) $notification->is_read,
                'created_at' => $notification->created_at?->format('d M Y H:i'),
            ])
            ->values()
            ->all();

        return Inertia::render('User/Profile', [
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
            'notifications' => $notifications,
        ]);
    })->name('profile');

    Route::put('/profile', function (Request $request) {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:150'],
            'last_name' => ['nullable', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $user->fill([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'] ?? '',
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'],
        ]);

        if (! empty($validated['password'])) {
            $user->password = $validated['password'];
        }

        $user->save();

        return redirect()->route('profile')->with('success', 'Profil berhasil diperbarui.');
    })->name('profile.update');
});
