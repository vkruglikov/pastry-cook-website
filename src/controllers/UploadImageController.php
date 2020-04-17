<?php

namespace App\Controllers;

use App\Modules\Images;

class UploadImageController extends SessionAbstractController
{
    function upload()
    {
        if (!$this->auth->isAuthorized()) {
            // TODO Заменить все эксепшены на логические и обрабатывать их
            throw new \Exception('Не авторизован');
        }

        $crop = @json_decode(urldecode($_POST['crop']), true) ?? null;
        $resize = @json_decode(urldecode($_POST['resize']), true) ?? null;
        $file = $_FILES['file'] ?? null;

        if (!$file) {
            throw new \Exception();
        }

        $images_module = new Images();
        $image_data = $images_module->add($this->auth->get('user_id'), $file['tmp_name'], $crop, $resize);

        return [
            'type' => 'json',
            'data' => [
                'id' => $image_data['id'],
                'url' => $image_data['public'],
            ]
        ];
    }
}