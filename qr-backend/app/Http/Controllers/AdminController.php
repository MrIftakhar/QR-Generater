<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    public function stats(Request $request)
    {
        // Fetch users along with their QR codes count (adjust 'qrCodes' relation name if necessary)
        $users = User::withCount('qrCodes')->get();

        return response()->json([
            'total_users' => User::count(),
            'total_qr_codes' => \App\Models\QrCode::count(),
            'users' => $users,
        ]);
    }
}