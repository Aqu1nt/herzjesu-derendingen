<?php

namespace App\Models;

use App\Services\ImageService;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        "start",
        "end",
        "date",
        "title",
        "location",
        "desc",
        "flyer"
    ];

    // this is a recommended way to declare event handlers
    protected static function boot() {
        parent::boot();

        static::deleting(function(Event $event) { // before delete() method call this
            if (file_exists(ImageService::path($event->flyer))) unlink(ImageService::path($event->flyer));
        });
    }
}
