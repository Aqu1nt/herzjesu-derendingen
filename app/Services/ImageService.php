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

    static function init()
    {
        if (!file_exists(self::$DIRECTORY)) {
            mkdir(self::$DIRECTORY);
        }
    }

    /**
     * Provides the full path to the file
     * @param $name
     * @return string
     */
    public static function path($name)
    {
        return static::$DIRECTORY."/".$name;
    }

    /**
     * Stores the data with a random filename and the correct file extension
     * @param $data
     * @param $ext
     * @return string
     */
    public static function save($data, $ext)
    {
        $fileName = self::path(uniqid("profile-pic").".".$ext);
        $handle = fopen($fileName, 'w+');
        fwrite($handle, $data);
        fclose($handle);
        return $fileName;
    }
}

ImageService::init();