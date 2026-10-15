<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class QrCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'uuid', 
        'title', 
        'type', 
        'content', 
        'is_dynamic', 
        'options'
    ];

    // Automatically cast the options JSON column to an array
    protected $casts = [
        'options' => 'array',
        'is_dynamic' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function scans()
    {
        return $this->hasMany(QrScan::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}