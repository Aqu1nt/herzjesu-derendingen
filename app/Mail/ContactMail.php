<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    private $formData;

    /**
     * Create a new message instance.
     *
     * @param $formData
     */
    public function __construct($formData)
    {
        $this->formData = $formData;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->formData["msg"] = str_replace("\n", "<br>", $this->formData["message"]);
        return $this->subject("Web Kontakt: ".$this->formData["concern"])->view('emails.contact')->with($this->formData);
    }
}
