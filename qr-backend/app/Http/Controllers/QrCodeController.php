<?php

namespace App\Http\Controllers;

use App\Models\QrCode;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class QrCodeController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->qrCodes()->withCount('scans')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string',
            'content' => 'required',
            'fg_color' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'frame_text' => 'nullable|string',
        ]);

        $qr = $request->user()->qrCodes()->create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'content' => is_array($validated['content']) ? json_encode($validated['content']) : $validated['content'],
            'short_url_code' => Str::random(6),
            'fg_color' => $validated['fg_color'] ?? '#000000',
            'bg_color' => $validated['bg_color'] ?? '#ffffff',
            'frame_text' => $validated['frame_text'] ?? 'SCAN ME',
        ]);

        return response()->json(['message' => 'QR Code created successfully!', 'qr' => $qr], 201);
    }

    public function destroy(Request $request, $id)
    {
        $qr = $request->user()->qrCodes()->where('id', $id)->firstOrFail();
        $qr->delete();
        return response()->json(['message' => 'QR Code deleted successfully!']);
    }
}