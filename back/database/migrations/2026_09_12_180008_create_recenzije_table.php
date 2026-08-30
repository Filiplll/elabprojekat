<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recenzije', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rezervacija_id')->constrained('rezervacije')->onDelete('cascade');
            $table->foreignId('igrac_id')->constrained('users')->onDelete('cascade');
            $table->unsignedTinyInteger('ocena');
            $table->text('komentar')->nullable();
            $table->enum('status', ['na_cekanju', 'odobrena', 'odbijena'])->default('na_cekanju');
            $table->timestamps();
            $table->unique(['rezervacija_id', 'igrac_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recenzije');
    }
};
