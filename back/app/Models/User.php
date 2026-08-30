<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'ime',
        'prezime',
        'email',
        'password',
        'type',
        'banovan',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'banovan' => 'boolean',
        ];
    }

    public function tereni()
    {
        return $this->hasMany(Teren::class, 'vlasnik_id');
    }

    public function rezervacije()
    {
        return $this->hasMany(Rezervacija::class, 'igrac_id');
    }

    public function prijave()
    {
        return $this->hasMany(PozivUcesnik::class, 'igrac_id');
    }

    public function pozivi()
    {
        return $this->belongsToMany(JavniPoziv::class, 'poziv_ucesnici', 'igrac_id', 'poziv_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    public function recenzije()
    {
        return $this->hasMany(Recenzija::class, 'igrac_id');
    }

    public function scopeBanovani($query)
    {
        return $query->where('banovan', true);
    }

    public function getPunoImeAttribute(): string
    {
        return "{$this->ime} {$this->prezime}";
    }

    public function isAdmin(): bool
    {
        return $this->type === 'admin';
    }

    public function isVlasnik(): bool
    {
        return $this->type === 'vlasnik';
    }

    public function isIgrac(): bool
    {
        return $this->type === 'igrac';
    }
}
