<?php
/**
 * Created by IntelliJ IDEA.
 * User: Emil
 * Date: 27.07.2016
 * Time: 17:36
 */
namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class EventController extends Controller
{

    public function index()
    {
        return Event::where("start", ">=", time() * 1000)->orderBy('start', 'ASC')->get();
    }

    public function create(Request $request)
    {
        return Event::create($request->all());
    }

    public function update($id, Request $request)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(["message" => "Event with id $id does not exist!"], 404);
        }

        //Update the model
        foreach($request->all() as $k => $v) $event->$k = $v;
        $event->save();
        return $event;
    }

    public function delete($id)
    {
        $affected = Event::destroy($id);
        return response()->json(["deleted" => !!$affected], $affected ? 200 : 404);
    }

    public function locations()
    {
        return Event::select(DB::raw("location, COUNT(*)"))
            ->groupBy("location")
            ->orderBy("COUNT(*)", "DESC")
            ->limit(100)
            ->get()
            ->map(function($i){
                return $i->location;
            });
    }
}