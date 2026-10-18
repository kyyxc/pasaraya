<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'method',
        'provider',
        'transaction_reference',
        'amount',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public const METHOD_BANK_TRANSFER = 'bank_transfer';

    public const METHOD_E_WALLET = 'e_wallet';

    public const METHOD_CASH_PICKUP = 'cash_pickup';

    public const METHOD_CASH_ON_DELIVERY = 'cash_on_delivery';

    public const STATUS_PENDING = 'pending';

    public const STATUS_PAID = 'paid';

    public const STATUS_FAILED = 'failed';

    public const STATUS_EXPIRED = 'expired';

    public const STATUS_REFUNDED = 'refunded';

    public const STATUS_PARTIALLY_REFUNDED = 'partially_refunded';

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
