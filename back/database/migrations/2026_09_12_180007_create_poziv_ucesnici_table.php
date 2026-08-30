<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('poziv_ucesnici', function (Blueprint $table) {
            $table->id();
            $table->foreignId('poziv_id')->constrained('javni_pozivi')->onDelete('cascade');
            $table->foreignId('igrac_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['prijavljen', 'otkazan'])->default('prijavljen');
            $table->timestamps();
            $table->unique(['poziv_id', 'igrac_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('poziv_ucesnici');
    }
};
