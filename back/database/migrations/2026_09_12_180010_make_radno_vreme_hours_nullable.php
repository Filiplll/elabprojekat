<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('radno_vreme', function (Blueprint $table) {
            $table->time('otvara_u')->nullable()->change();
            $table->time('zatvara_u')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('radno_vreme', function (Blueprint $table) {
            $table->time('otvara_u')->nullable(false)->change();
            $table->time('zatvara_u')->nullable(false)->change();
        });
    }
};
