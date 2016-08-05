<?php

namespace App\Models;

use App\Services\ImageService;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{

    protected $fillable = [
        'gallery_id', 'name', 'image_path', 'thumb_path'
    ];

    public function gallery()
    {
        return $this->belongsTo('App\Models\Gallery');
    }

    // this is a recommended way to declare event handlers
    protected static function boot() {
        parent::boot();

        static::deleting(function(Image $image) { // before delete() method call this
            if (file_exists(ImageService::path($image->image_path))) unlink(ImageService::path($image->image_path));
            if (file_exists(ImageService::path($image->thumb_path))) unlink(ImageService::path($image->thumb_path));
        });
    }
}
