<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sport extends Model
{
    use HasFactory;

    protected $table = 'sportovi';

    protected $fillable = ['naziv'];

    public function tereni()
    {
        return $this->belongsToMany(Teren::class, 'teren_sport', 'sport_id', 'teren_id')
            ->withTimestamps();
    }
}
