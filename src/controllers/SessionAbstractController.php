<?php


namespace App\Controllers;


use App\Modules\Auth;

abstract class SessionAbstractController extends AbstractController
{
    function __construct()
    {
        parent::__construct();

        session_start();
        $this->auth = new Auth();
    }

}