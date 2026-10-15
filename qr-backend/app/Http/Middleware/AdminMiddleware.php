<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Check if user exists and is an admin (supports 1, true, "1")
        if (!$user || ($user->is_admin != 1 && $user->is_admin !== true)) {
            return response()->json([
                'message' => 'Unauthorized access. Admins only.'
            ], 403);
        }

        return $next($request);
    }
}