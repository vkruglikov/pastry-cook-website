<?php

namespace App\Controllers;


use App\Modules\Lessons;

class PublicController extends SessionAbstractController
{
    function post()
    {
        if (!$this->auth->isAuthorized()) {
            // TODO Заменить все эксепшены на логические и обрабатывать их
            throw new \Exception();
        }

        $input_body = @json_decode(file_get_contents('php://input'), true) ?? [];

        $user_id = $this->auth->get('user_id');
        $title = $input_body['title'] ?? '';
        $subtitle = $input_body['subtitle'] ?? null;
        $cover = $input_body['cover'] ?? null;

        $public_module = new \App\Modules\PublicPage();
        $new_public = $public_module->add($user_id, $title, $subtitle, $cover['id'] ?? null);

        return [
            'type' => 'json',
            'data' => $new_public
        ];
    }
}