<?php
/**
 * Created by IntelliJ IDEA.
 * User: Emil
 * Date: 05.08.2016
 * Time: 12:56
 */

namespace App\Services;

class ImageService
{
    /**
     * The directory where all images are saved
     * @var string
     */
    static $DIRECTORY = "uploads";

    /**
     * Provides the full path to the file
     * @param $name
     * @return string
     */
    public static function path($name)
    {
        return static::$DIRECTORY.DIRECTORY_SEPARATOR.$name;
    }
}