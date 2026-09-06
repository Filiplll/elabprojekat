<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'broj_terena' => $this->whenCounted('tereni'),
            'created_at' => $this->created_at?->format('d.m.Y. H:i'),
        ];
    }
}
