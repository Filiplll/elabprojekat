<?php

use App\Models\Rezervacija;
use App\Models\Teren;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

describe('Rezervacija otkazivanje Feature Testovi', function () {

    beforeEach(function () {
        $this->igrac = User::factory()->create(['type' => 'igrac']);
        $this->teren = Teren::factory()->create();
        $this->rezervacija = Rezervacija::factory()->create([
            'teren_id' => $this->teren->id,
            'igrac_id' => $this->igrac->id,
            'status' => 'na_cekanju',
        ]);
    });

    it('igrač može da otkaže sopstvenu rezervaciju', function () {
        Sanctum::actingAs($this->igrac);

        $response = $this->patchJson("/api/rezervacije/{$this->rezervacija->id}/otkazi");

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonPath('data.status', 'otkazana');

        expect($this->rezervacija->fresh()->status)->toBe('otkazana');
    });

    it('zabranjuje otkazivanje tuđe rezervacije', function () {
        $drugiIgrac = User::factory()->create(['type' => 'igrac']);
        Sanctum::actingAs($drugiIgrac);

        $response = $this->patchJson("/api/rezervacije/{$this->rezervacija->id}/otkazi");

        $response->assertStatus(403);

        expect($this->rezervacija->fresh()->status)->toBe('na_cekanju');
    });

    it('ne dozvoljava ponovno otkazivanje već otkazane rezervacije (Custom Validation Test)', function () {
        $this->rezervacija->update(['status' => 'otkazana']);
        Sanctum::actingAs($this->igrac);

        $response = $this->patchJson("/api/rezervacije/{$this->rezervacija->id}/otkazi");

        $response->assertStatus(409)
            ->assertJson([
                'success' => false,
                'error' => 'Rezervacija je već otkazana.',
            ]);
    });

    it('ne dozvoljava otkazivanje odigrane rezervacije', function () {
        $this->rezervacija->update(['status' => 'odigrana']);
        Sanctum::actingAs($this->igrac);

        $response = $this->patchJson("/api/rezervacije/{$this->rezervacija->id}/otkazi");

        $response->assertStatus(409)
            ->assertJson([
                'success' => false,
                'error' => 'Odigrana rezervacija se više ne može menjati.',
            ]);
    });
});
