<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'reference_type',
        'reference_id',
        'is_read',
        'read_at',
        'created_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'created_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    public static function forUser(User $user)
    {
        return self::query()
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhere('reference_type', 'all')
                    ->orWhere('reference_type', $user->role);
            })
            ->latest('created_at')
            ->limit(10)
            ->get();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
