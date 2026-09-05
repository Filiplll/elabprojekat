<?php

namespace App\Services;

use App\Models\Rezervacija;
use App\Models\Teren;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Throwable;

class RezervacijaManager
{
    public function __construct(
        private RezervacijaService $rezervacijaService,
        private EmailService $emailService
    ) {}

    public function rezervisi(Teren $teren, array $data, User $igrac): Rezervacija
    {
        $rezervacija = $this->rezervacijaService->kreiraj($teren, $data, $igrac);

        $this->obavesti(
            $rezervacija,
            'igrac',
            'Termin je zakazan',
            'Uspešno si zakazao termin. Rezervacija čeka potvrdu vlasnika terena.'
        );

        $this->obavesti(
            $rezervacija,
            'vlasnik',
            'Nova rezervacija na tvom terenu',
            'Igrač je zakazao termin na tvom terenu. Rezervacija čeka tvoju potvrdu.'
        );

        return $rezervacija;
    }

    public function promeniTermin(Rezervacija $rezervacija, array $data): Rezervacija
    {
        $stariTermin = $rezervacija->termin;

        $rezervacija = $this->rezervacijaService->promeniTermin($rezervacija, $data);

        $this->obavesti(
            $rezervacija,
            'vlasnik',
            'Igrač je pomerio termin',
            'Igrač je promenio termin rezervacije na tvom terenu.',
            ['Raniji termin' => $stariTermin]
        );

        return $rezervacija;
    }

    public function otkazi(Rezervacija $rezervacija): Rezervacija
    {
        $rezervacija = $this->rezervacijaService->otkazi($rezervacija);

        $this->obavesti(
            $rezervacija,
            'vlasnik',
            'Igrač je otkazao termin',
            'Igrač je otkazao rezervaciju, termin je ponovo slobodan.'
        );

        return $rezervacija;
    }

    public function promeniStatus(Rezervacija $rezervacija, string $status): Rezervacija
    {
        $rezervacija = $this->rezervacijaService->promeniStatus($rezervacija, $status);

        $potvrdjena = $rezervacija->status === 'potvrdjena';

        $this->obavesti(
            $rezervacija,
            'igrac',
            $potvrdjena ? 'Rezervacija je potvrđena' : 'Rezervacija je otkazana',
            $potvrdjena
                ? 'Vlasnik terena je potvrdio tvoju rezervaciju. Vidimo se na terenu.'
                : 'Vlasnik terena je otkazao tvoju rezervaciju.'
        );

        return $rezervacija;
    }

    private function obavesti(Rezervacija $rezervacija, string $primalac, string $naslov, string $poruka, array $dodatno = []): void
    {
        $rezervacija->loadMissing(['teren.vlasnik', 'igrac']);

        $email = $primalac === 'igrac'
            ? $rezervacija->igrac->email
            : $rezervacija->teren->vlasnik->email;

        $detalji = [
            'Teren' => $rezervacija->teren->naziv,
            'Adresa' => $rezervacija->teren->grad . ', ' . $rezervacija->teren->adresa,
            'Termin' => $rezervacija->termin,
            'Trajanje' => $rezervacija->trajanje,
            'Cena' => $rezervacija->formatirana_cena,
            'Status' => $rezervacija->status,
        ];

        if ($primalac === 'vlasnik') {
            $detalji['Igrač'] = $rezervacija->igrac->puno_ime;
            $detalji['Email igrača'] = $rezervacija->igrac->email;
        } else {
            $detalji['Vlasnik terena'] = $rezervacija->teren->vlasnik->puno_ime;
        }

        try {
            $this->emailService->send($email, $naslov, $poruka, array_merge($detalji, $dodatno));
        } catch (Throwable $e) {
            Log::warning("Obaveštenje za rezervaciju {$rezervacija->id} nije poslato: {$e->getMessage()}");
        }
    }
}
