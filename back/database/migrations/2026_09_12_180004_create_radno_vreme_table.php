<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('radno_vreme', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teren_id')->constrained('tereni')->onDelete('cascade');
            $table->unsignedTinyInteger('dan_u_nedelji');
            $table->time('otvara_u');
            $table->time('zatvara_u');
            $table->boolean('radi')->default(true);
            $table->timestamps();
            $table->unique(['teren_id', 'dan_u_nedelji']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('radno_vreme');
    }
};
