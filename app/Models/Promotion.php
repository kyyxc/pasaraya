<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'image_url',
        'button_text',
        'button_link',
        'status',
        'starts_at',
        'ends_at',
        'sort_order',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'sort_order' => 'integer',
    ];

    public const STATUS_DRAFT = 'draft';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_SCHEDULED = 'scheduled';

    public const STATUS_INACTIVE = 'inactive';

    public static function statuses(): array
    {
        return [
            self::STATUS_DRAFT,
            self::STATUS_ACTIVE,
            self::STATUS_SCHEDULED,
            self::STATUS_INACTIVE,
        ];
    }
}
