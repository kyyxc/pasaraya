<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            $user = Auth::user();

            return redirect()->route($user->role === User::ROLE_SELLER ? 'seller.dashboard' : 'home');
        }

        return Inertia::render('Login', [
            'message' => 'Silakan masuk',
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = Auth::user();

            return redirect()->intended(
                $user && $user->role === User::ROLE_SELLER
                    ? route('seller.dashboard')
                    : route('home')
            );
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->withInput()->onlyInput('email');
    }

    public function showRegister()
    {
        if (Auth::check()) {
            $user = Auth::user();

            return redirect()->route($user->role === User::ROLE_SELLER ? 'seller.dashboard' : 'home');
        }

        return Inertia::render('Register', [
            'message' => 'Silakan daftar',
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:150'],
            'last_name' => ['required', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['required', 'string', 'email', 'max:254', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'city' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => User::ROLE_BUYER,
            'is_active' => true,
            'is_staff' => false,
            'date_joined' => now(),
            'updated_at' => now(),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('home');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
