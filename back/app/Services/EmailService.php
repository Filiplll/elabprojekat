<?php

namespace App\Services;

use App\Mail\NotificationMail;
use Illuminate\Support\Facades\Mail;

class EmailService
{
    public function send(string $recipient, string $title, string $body, array $details = []): void
    {
        Mail::to($recipient)->send(new NotificationMail($title, $body, $details));
    }
}
