<?php
namespace App\Http\Controllers;


use App\Models\Person;
use App\Services\ImageService;
use Illuminate\Http\Request;

class PersonController extends Controller
{

    public function allPersons()
    {
        return Person::all();
    }

    public function delete($id)
    {
        $affected = Person::destroy($id);
        return response()->json(["deleted" => !!$affected], $affected ? 200 : 404);
    }

    public function update(Request $request, $id)
    {
        $person = Person::find($id);
        if (file_exists($person->image_path)) {
            unlink($person->image_path);
        }

        $person->image_path = "";
        $person->title = $request->input("title");
        $person->fields = $request->input("fields");
        $imageBase64 = $request->input("imageBase64");
        if ($imageBase64)
        {
            $imageExt = $request->input("imageExt");
            $rawData = base64_decode($imageBase64);
            $person->image_path = ImageService::save($rawData, $imageExt);
        }

        $person->save();

        return $person;
    }

    public function create(Request $request)
    {
        $file = "";
        $title = $request->input("title");
        $fields = $request->input("fields");
        $imageBase64 = $request->input("imageBase64");
        if ($imageBase64)
        {
            $imageExt = $request->input("imageExt");
            $rawData = base64_decode($imageBase64);
            $file = ImageService::save($rawData, $imageExt);
        }

        $person = Person::create([
            "image_path" => $file,
            "fields" => $fields,
            "title" => $title
        ]);

        return $person;
    }
}