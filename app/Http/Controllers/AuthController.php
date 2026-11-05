<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            $user = Auth::user();

            return redirect()->route(match ($user->role) {
                User::ROLE_ADMIN => 'admin.dashboard',
                User::ROLE_SELLER => 'seller.dashboard',
                default => 'home',
            });
        }

        return Inertia::render('User/Login', [
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

            return redirect()->route(match ($user?->role) {
                User::ROLE_ADMIN => 'admin.dashboard',
                User::ROLE_SELLER => 'seller.dashboard',
                default => 'home',
            });
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->withInput()->onlyInput('email');
    }

    public function showRegister()
    {
        if (Auth::check()) {
            $user = Auth::user();

            return redirect()->route(match ($user->role) {
                User::ROLE_ADMIN => 'admin.dashboard',
                User::ROLE_SELLER => 'seller.dashboard',
                default => 'home',
            });
        }

        return Inertia::render('User/Register', [
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

    public function redirectToGoogle(): RedirectResponse|\Symfony\Component\HttpFoundation\RedirectResponse
    {
        try {
            return Socialite::driver('google')->redirect();
        } catch (Throwable $e) {
            return redirect()->route('login')->withErrors([
                'google' => 'Gagal mengarahkan ke Google OAuth. Pastikan GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET sudah dikonfigurasi di file .env: '.$e->getMessage(),
            ]);
        }
    }

    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable $e) {
            return redirect()->route('login')->withErrors([
                'google' => 'Gagal masuk dengan akun Google: '.$e->getMessage(),
            ]);
        }

        $email = $googleUser->getEmail();

        if (! $email) {
            return redirect()->route('login')->withErrors([
                'google' => 'Akun Google Anda tidak menyediakan alamat email yang valid.',
            ]);
        }

        $googleId = (string) $googleUser->getId();
        $googleName = trim((string) $googleUser->getName());
        $firstName = $googleUser->user['given_name'] ?? null;
        $lastName = $googleUser->user['family_name'] ?? null;

        if (! $firstName) {
            $nameParts = explode(' ', $googleName, 2);
            $firstName = $nameParts[0] ?: 'Pengguna';
            $lastName = $nameParts[1] ?? '-';
        }

        $lastName = $lastName ?: '-';

        $user = User::query()->where('google_id', $googleId)->first();

        if (! $user) {
            $user = User::query()->where('email', mb_strtolower(trim($email)))->first();

            if ($user) {
                $user->update([
                    'google_id' => $googleId,
                    'avatar' => $user->avatar ?: $googleUser->getAvatar(),
                ]);
            }
        }

        if (! $user) {
            $user = User::create([
                'first_name' => mb_substr($firstName, 0, 150),
                'last_name' => mb_substr($lastName, 0, 150),
                'email' => $email,
                'google_id' => $googleId,
                'avatar' => $googleUser->getAvatar(),
                'password' => null,
                'role' => User::ROLE_BUYER,
                'is_active' => true,
                'is_staff' => false,
                'date_joined' => now(),
                'updated_at' => now(),
            ]);
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        return redirect()->intended(
            match ($user->role) {
                User::ROLE_ADMIN => route('admin.dashboard'),
                User::ROLE_SELLER => route('seller.dashboard'),
                default => route('home'),
            }
        );
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
