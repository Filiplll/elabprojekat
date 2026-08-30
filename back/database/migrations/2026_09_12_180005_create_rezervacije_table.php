<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rezervacije', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teren_id')->constrained('tereni')->onDelete('cascade');
            $table->foreignId('igrac_id')->constrained('users')->onDelete('cascade');
            $table->date('datum');
            $table->time('vreme_od');
            $table->time('vreme_do');
            $table->decimal('cena_ukupno', 8, 2);
            $table->enum('status', ['na_cekanju', 'potvrdjena', 'otkazana', 'odigrana'])->default('na_cekanju');
            $table->timestamps();
            $table->index(['teren_id', 'datum']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rezervacije');
    }
};
