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
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained('orders')->cascadeOnDelete();
            $table->string('method', 30);
            $table->string('status', 30)->default('pending');
            $table->decimal('delivery_fee', 12, 2)->default(0);
            $table->text('pickup_location')->nullable();
            $table->text('delivery_address')->nullable();
            $table->string('recipient_name', 150);
            $table->string('recipient_phone', 20);
            $table->text('delivery_notes')->nullable();
            $table->dateTime('scheduled_at')->nullable();
            $table->dateTime('handed_over_at')->nullable();
            $table->dateTime('created_at');
            $table->dateTime('updated_at');
        });

        DB::statement("ALTER TABLE `deliveries` ADD CONSTRAINT `chk_deliveries_method_valid` CHECK (`method` IN ('pickup', 'seller_delivery'))");
        DB::statement("ALTER TABLE `deliveries` ADD CONSTRAINT `chk_deliveries_status_valid` CHECK (`status` IN ('pending', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'completed', 'failed'))");
        DB::statement('ALTER TABLE `deliveries` ADD CONSTRAINT `chk_deliveries_delivery_fee_non_negative` CHECK (`delivery_fee` >= 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};
