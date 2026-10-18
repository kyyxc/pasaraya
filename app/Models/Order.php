<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'buyer_id',
        'store_id',
        'status',
        'subtotal',
        'delivery_fee',
        'discount_amount',
        'total',
        'buyer_note',
        'recipient_name',
        'recipient_phone',
        'delivery_address',
        'completed_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'completed_at' => 'datetime',
    ];

    public const STATUS_PENDING_PAYMENT = 'pending_payment';

    public const STATUS_CONFIRMED = 'confirmed';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_READY_FOR_PICKUP = 'ready_for_pickup';

    public const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_CANCELLED = 'cancelled';

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
