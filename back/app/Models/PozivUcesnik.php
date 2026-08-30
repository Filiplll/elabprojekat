<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PozivUcesnik extends Model
{
    use HasFactory;

    protected $table = 'poziv_ucesnici';

    protected $fillable = ['poziv_id', 'igrac_id', 'status'];

    public function poziv()
    {
        return $this->belongsTo(JavniPoziv::class, 'poziv_id');
    }

    public function igrac()
    {
        return $this->belongsTo(User::class, 'igrac_id');
    }

    public function scopePrijavljeni($query)
    {
        return $query->where('status', 'prijavljen');
    }
}
