<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teren_sport', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teren_id')->constrained('tereni')->onDelete('cascade');
            $table->foreignId('sport_id')->constrained('sportovi')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['teren_id', 'sport_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teren_sport');
    }
};
