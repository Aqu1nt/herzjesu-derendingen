<?php
namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    /**
     * @return \Illuminate\Http\JsonResponse 
     */
    public function isLoggedIn()
    {
        return response()->json(["loggedIn" => Auth::check()]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->input("email"), 'password' => $request->input("password")])) {
            return Auth::user();
        }
        return response()->json(["message" => "invalid login"], 403);
    }

    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        if (Auth::check()) {
            Auth::logout();
            return response()->json(["success" => true]);
        } else {
            return response()->json(["success" => false]);
        }
    }

    /**
     * @return User
     */
    protected function createAdmin()
    {
        return $this->create([
            "name" => "admin",
            "email" => "admin@herzjesu-derendingen.ch",
            "password" => env("ADMIN_PASSWORD")
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }
}