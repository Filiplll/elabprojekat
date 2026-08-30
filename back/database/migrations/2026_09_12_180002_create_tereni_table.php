<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tereni', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vlasnik_id')->constrained('users')->onDelete('cascade');
            $table->string('naziv');
            $table->string('grad')->index();
            $table->string('adresa');
            $table->decimal('cena_po_satu', 8, 2);
            $table->boolean('natkriven')->default(false);
            $table->boolean('aktivan')->default(true);
            $table->text('opis')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tereni');
    }
};
