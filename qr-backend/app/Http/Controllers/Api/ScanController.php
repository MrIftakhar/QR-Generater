<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QrCode;
use App\Models\QrScan;
use Illuminate\Http\Request;

class ScanController extends Controller
{
    public function redirect(Request $request, string $uuid)
    {
        $qrCode = QrCode::where('uuid', $uuid)->firstOrFail();

        // Record scan analytics
        QrScan::create([
            'qr_code_id' => $qrCode->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
        ]);

        // Redirect user to the target content/URL
        return redirect()->away($qrCode->content);
    }
}