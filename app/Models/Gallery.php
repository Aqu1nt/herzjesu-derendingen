<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $fillable = [
        "name"
    ];

    public function setNameAttribute($name)
    {
        $this->attributes['name'] = $name;
        $this->attributes['slug'] = str_slug($name);
    }

    public function images()
    {
        return $this->hasMany('App\Models\Image')->orderBy('id', 'DESC');
    }

    // this is a recommended way to declare event handlers
    protected static function boot() {
        parent::boot();

        static::deleting(function(Gallery $gallery) { // before delete() method call this
            Image::destroy($gallery->images->map(function($i){ return $i->id; })->toArray());
        });
    }
}
