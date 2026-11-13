<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('method', 30);
            $table->string('provider', 100)->nullable();
            $table->string('transaction_reference', 150)->nullable();
            $table->decimal('amount', 12, 2);
            $table->string('status', 30)->default('pending');
            $table->dateTime('paid_at')->nullable();
            $table->dateTime('created_at');
            $table->dateTime('updated_at');

            $table->index(['order_id', 'status']);
        });

        DB::statement("
            ALTER TABLE payments
            ADD CONSTRAINT chk_payments_method_valid
            CHECK (
                method IN (
                    'bank_transfer',
                    'e_wallet',
                    'cash_pickup',
                    'cash_on_delivery'
                )
            )
        ");

        DB::statement("
            ALTER TABLE payments
            ADD CONSTRAINT chk_payments_status_valid
            CHECK (
                status IN (
                    'pending',
                    'paid',
                    'failed',
                    'expired',
                    'refunded',
                    'partially_refunded'
                )
            )
        ");

        DB::statement("
            ALTER TABLE payments
            ADD CONSTRAINT chk_payments_amount_non_negative
            CHECK (amount >= 0)
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
