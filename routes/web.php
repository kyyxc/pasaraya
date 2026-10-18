<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'message' => 'Welcome to Pasaraya',
    ]);
});
Route::get('/login', function () {
    return Inertia::render('Login', [
        'message' => 'Please log in',
    ]);
});
Route::get('/register', function () {
    return Inertia::render('Register', [
        'message' => 'Please register',
    ]);
});