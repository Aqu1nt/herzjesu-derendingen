<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    protected $table = "persons";

    protected $fillable = [
        "fields",
        "image_path",
        "title"
    ];

    // this is a recommended way to declare event handlers
    protected static function boot() {
        parent::boot();

        static::deleting(function(Person $person) { // before delete() method call this
            if (file_exists($person->image_path)) unlink($person->image_path);
        });
    }
}
