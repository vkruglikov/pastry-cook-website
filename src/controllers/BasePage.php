<?php

namespace App\Controllers;

class BasePage extends SessionAbstractController
{
    public $meta_data = [
        'title' => 'Кондитерские курсы PASTRY-COOK.ru'
    ];

    function __construct()
    {
        parent::__construct();
        $this->putStoreStateData([
            'user' => $this->auth->getAuthData()
        ]);
    }

    function index()
    {
        return [
            'type' => 'html'
        ];
    }

    function login()
    {
        return [
            'type' => 'html'
        ];
    }

    function setMeta(array $data)
    {
        $this->meta_data = array_merge($this->meta_data, $data);
    }

}