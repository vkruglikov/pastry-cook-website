<?php

namespace App\Controllers;


use App\Modules\Auth;

abstract class AbstractController
{
    /**
     * @var Auth
     */
    public $auth;
    public $static_data = [];
    public $store_state = [];

    function __construct()
    {

    }

    function redirect($path)
    {
        header('Location: ' . $path);
        exit();
    }

    function putStaticData($data)
    {
        $this->static_data = array_merge($this->static_data, $data);
    }

    function putStoreStateData($data)
    {
        $this->store_state = array_merge($this->store_state, $data);
    }

}