<?php

namespace App\Http\Controllers;

use App\Mail\ContactMail;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    //
    public function sendContactEmail(Request $request)
    {
        Mail::to(env("ADMIN_EMAIL"))->send(new ContactMail($request->all()));
    }
}
