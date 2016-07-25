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

        //MagicURL to create the admin user
        Route::get('/admin', 'Auth\AuthController@createAdmin');
    });

});
