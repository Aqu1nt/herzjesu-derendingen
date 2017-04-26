<?php
/**
 * Created by IntelliJ IDEA.
 * User: Emil
 * Date: 03.08.2016
 * Time: 08:09
 */
namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\Image;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

class GalleryController extends Controller
{

    /**
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function all()
    {
        return Gallery::orderBy("id", "DESC")->with('images')->get();
    }

    /**
     * Creates a new gallery
     * @param Request $request
     * @return mixed
     */
    public function create(Request $request)
    {
        //Check unique slug
        $slug = str_slug($request->input('name'));
        if (Gallery::where("slug", "=", $slug)->exists()) {
            return response()->json(["message" => "Gallery already exists"], 400);
        }

        $gallery = new Gallery();
        $gallery->name = $request->input('name');
        $gallery->save();
        return $gallery;
    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function editName(Request $request, $id)
    {
        //Check unique slug
        $slug = str_slug($request->input('name'));
        if (Gallery::where("slug", "=", $slug)->exists()) {
            return response()->json(["message" => "Gallery already exists"], 400);
        }

        $gallery = Gallery::find($id);
        $gallery->name = $request->input("name");
        $gallery->save();
        return $gallery;
    }

    /**
     * Deletes the gallery with id "id"
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete($id)
    {
        $affected = Gallery::destroy($id);
        return response()->json(["deleted" => !!$affected], $affected ? 200 : 404);
    }

    /**
     * Receives multiple images
     */
    public function uploadImages($id)
    {

        $images = Input::file('file');
        if (!$images) {
            return;
        }

        $createdImages = [];

        foreach ($images as $image) {
            $name = $image->getClientOriginalName();
            $tokens = explode(".", $name);
            $ext = array_pop($tokens);
            $randomName = uniqid().".".$ext;
            $image->move(ImageService::$DIRECTORY, $randomName);

            $createdImages[] = Image::create([
                "gallery_id" => $id,
                "name" => implode(".", $tokens),
                "image_path" => $randomName,
                "thumb_path" => $randomName
            ]);
        }

        return response()->json(["images" => $createdImages]);
    }

    public function deleteImage($id, $imageId)
    {
        $success = Image::destroy($imageId);
        return response()->json(["deleted" => !!$success], $success ? 200 : 404);
    }
}