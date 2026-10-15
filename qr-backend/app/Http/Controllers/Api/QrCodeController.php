<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class QrCodeController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->qrCodes()->latest()->get()
        );
    }

public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:url,wifi,vcard,text,email,phone',
            'content' => 'required|string',
            'is_dynamic' => 'sometimes|boolean',
            'options' => 'nullable|array',
        ]);

        $validated['uuid'] = (string) \Illuminate\Support\Str::uuid();
        // Respect user's choice; default to true if not provided
        $validated['is_dynamic'] = $request->has('is_dynamic') ? $request->boolean('is_dynamic') : true;

        $qrCode = $request->user()->qrCodes()->create($validated);

        return response()->json([
            'message' => 'QR Code created successfully!',
            'qr_code' => $qrCode
        ], 201);
    }

    public function show(Request $request, int $id)
    {
        $qrCode = $request->user()->qrCodes()->findOrFail($id);
        return response()->json($qrCode);
    }

    public function update(Request $request, int $id)
    {
        $qrCode = $request->user()->qrCodes()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:url,wifi,vcard,text,email,phone',
            'content' => 'required|string',
            'is_dynamic' => 'sometimes|boolean',
            'options' => 'nullable|array',
        ]);

        $qrCode->update($validated);

        return response()->json([
            'message' => 'QR Code updated successfully!',
            'qr_code' => $qrCode
        ]);
    }

    public function destroy(Request $request, int $id)
    {
        $qrCode = $request->user()->qrCodes()->findOrFail($id);
        $qrCode->delete();

        return response()->json(['message' => 'QR Code deleted successfully.']);
    }

    public function analytics(Request $request, int $id)
    {
        $qrCode = $request->user()->qrCodes()->findOrFail($id);

        return response()->json([
            'title' => $qrCode->title,
            'total_scans' => $qrCode->scans()->count(),
            'recent_scans' => $qrCode->scans()->latest()->take(10)->get(),
        ]);
    }
}