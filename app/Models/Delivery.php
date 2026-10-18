<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Delivery extends Model
{
    protected $fillable = [
        'order_id',
        'method',
        'status',
        'delivery_fee',
        'pickup_location',
        'delivery_address',
        'recipient_name',
        'recipient_phone',
        'delivery_notes',
        'scheduled_at',
        'handed_over_at',
    ];

    protected $casts = [
        'delivery_fee' => 'decimal:2',
        'scheduled_at' => 'datetime',
        'handed_over_at' => 'datetime',
    ];

    public const METHOD_PICKUP = 'pickup';

    public const METHOD_SELLER_DELIVERY = 'seller_delivery';

    public const STATUS_PENDING = 'pending';

    public const STATUS_PREPARING = 'preparing';

    public const STATUS_READY_FOR_PICKUP = 'ready_for_pickup';

    public const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
