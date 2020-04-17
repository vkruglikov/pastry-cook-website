<?php


namespace App\Controllers;


class Subscribe extends AbstractController
{
    function post()
    {
        $path_to_storage_subscribes = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'subscribes';

        if (!is_dir($path_to_storage_subscribes)) {
            mkdir($path_to_storage_subscribes, 0777, true);
        }

        $input_body = file_get_contents('php://input');
        file_put_contents($path_to_storage_subscribes . DIRECTORY_SEPARATOR . date('Y-m-d_H-i-s') . microtime() . '.txt', $input_body);

        return [
            'type' => 'json',
        ];
    }
}