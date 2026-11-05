<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectNonBuyerToDashboard
{
    /**
     * Redirect non-buyer authenticated users away from buyer-facing pages.
     */
    public function handle(Request $request, Closure $next): mixed
    {
        if (! Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();

        if ($user?->role === User::ROLE_ADMIN) {
            return redirect()->route('admin.dashboard');
        }

        if ($user?->role === User::ROLE_SELLER) {
            return redirect()->route('seller.dashboard');
        }

        return $next($request);
    }
}
