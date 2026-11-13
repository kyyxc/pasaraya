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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 40)->unique();
            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('status', 30);
            $table->decimal('subtotal', 12, 2);
            $table->decimal('delivery_fee', 12, 2);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->text('buyer_note')->nullable();
            $table->string('recipient_name', 150);
            $table->string('recipient_phone', 20);
            $table->text('delivery_address')->nullable();
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
            $table->dateTime('completed_at')->nullable();

            $table->index(['buyer_id', 'created_at']);
            $table->index(['store_id', 'status']);
        });

        DB::statement('ALTER TABLE "orders" ADD CONSTRAINT "chk_orders_subtotal_non_negative" CHECK ("subtotal" >= 0)');
        DB::statement('ALTER TABLE "orders" ADD CONSTRAINT "chk_orders_delivery_fee_non_negative" CHECK ("delivery_fee" >= 0)');
        DB::statement('ALTER TABLE "orders" ADD CONSTRAINT "chk_orders_discount_amount_non_negative" CHECK ("discount_amount" >= 0)');
        DB::statement('ALTER TABLE "orders" ADD CONSTRAINT "chk_orders_total_non_negative" CHECK ("total" >= 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
