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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('conversations')->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->string('message_type', 20);
            $table->text('content')->nullable();
            $table->string('attachment', 500)->nullable();
            $table->boolean('is_read')->default(false);
            $table->dateTime('read_at')->nullable();
            $table->dateTime('created_at');
            $table->dateTime('updated_at');

            $table->index(['conversation_id', 'created_at']);
        });

        DB::statement("
        ALTER TABLE messages
        ADD CONSTRAINT chk_messages_content_valid
        CHECK (
            (message_type = 'text' AND content IS NOT NULL)
            OR (message_type = 'image' AND attachment IS NOT NULL)
            OR message_type IN ('system')
        )
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
