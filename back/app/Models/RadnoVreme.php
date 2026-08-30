<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RadnoVreme extends Model
{
    use HasFactory;

    protected $table = 'radno_vreme';

    protected $fillable = ['teren_id', 'dan_u_nedelji', 'otvara_u', 'zatvara_u', 'radi'];

    protected $casts = [
        'dan_u_nedelji' => 'integer',
        'radi' => 'boolean',
    ];

    private const DANI = ['ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota', 'nedelja'];

    public static function nazivDana(int $dan): string
    {
        return self::DANI[$dan] ?? '';
    }

    public function teren()
    {
        return $this->belongsTo(Teren::class, 'teren_id');
    }

    public function scopeZaDan($query, int $dan)
    {
        return $query->where('dan_u_nedelji', $dan);
    }

    public function getNazivDanaAttribute(): string
    {
        return self::nazivDana($this->dan_u_nedelji);
    }

    public function getRadnoVremeAttribute(): string
    {
        if (! $this->radi) {
            return 'ne radi';
        }

        return substr((string) $this->otvara_u, 0, 5) . ' - ' . substr((string) $this->zatvara_u, 0, 5);
    }
}
