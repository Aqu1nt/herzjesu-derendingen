<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        "start",
        "end",
        "date",
        "title",
        "location",
        "desc"
    ];
}
