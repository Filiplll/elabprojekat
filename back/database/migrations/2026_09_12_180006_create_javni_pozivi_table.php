<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('javni_pozivi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rezervacija_id')->unique()->constrained('rezervacije')->onDelete('cascade');
            $table->unsignedTinyInteger('broj_slobodnih_mesta');
            $table->text('opis')->nullable();
            $table->boolean('aktivan')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('javni_pozivi');
    }
};
