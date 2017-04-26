<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('{url?}', function () {
    return view('index');
})->where('url', '(home)');


/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => ['web']], function () {

    Route::group(['prefix' => '/api/v1'], function(){

        //Auth section
        Route::group(['prefix' => '/auth'], function(){
            Route::post('/login', 'AuthController@login');
            Route::post('/logout', 'AuthController@logout');
            Route::get('/isLoggedIn', 'AuthController@isLoggedIn');
        });

        //Events
        Route::get("/events", 'EventController@index');
        Route::get("/events/locations", "EventController@locations");
        Route::group(['middleware' => 'auth'], function(){
            Route::put('/events/{id}', "EventController@update");
            Route::delete('/events/{id}', "EventController@delete");
            Route::post('/events', "EventController@create");
        });

        //Gallery
        Route::group(["prefix" => "/galleries"], function(){
            Route::get('', 'GalleryController@all');

            Route::group(['middleware' => 'auth'], function() {
                Route::post('', 'GalleryController@create');
                Route::put('/{id}', 'GalleryController@editName');
                Route::delete('/{id}', 'GalleryController@delete');
                Route::post('/{id}/images', 'GalleryController@uploadImages');
                Route::delete('/{id}/images/{imageId}', 'GalleryController@deleteImage');
            });
        });

        //Contact
        Route::group(["prefix" => "/contact"], function(){
           Route::post("/", "ContactController@sendContactEmail");
        });

        //Persons
        Route::group(["prefix" => "/persons"], function(){

            Route::get("", "PersonController@allPersons");

            Route::group(["middleware" => "auth"], function(){
                Route::post("", "PersonController@create");
                Route::put("/{id}", "PersonController@update");
                Route::delete("/{id}", "PersonController@delete");
            });
        });

        //MagicURL to create the admin user
        Route::get('/admin', 'AuthController@createAdmin');
    });

});
