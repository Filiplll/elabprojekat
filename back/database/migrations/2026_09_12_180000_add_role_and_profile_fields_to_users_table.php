<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('ime')->after('id');
            $table->string('prezime')->after('ime');
            $table->enum('type', ['admin', 'vlasnik', 'igrac'])->after('password');
            $table->boolean('banovan')->default(false)->after('type');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['ime', 'prezime', 'type', 'banovan']);
        });
    }
};
