<?php

namespace App\Controllers;


use App\Modules\Lessons;

class LessonController extends SessionAbstractController
{
    function post()
    {
        if (!$this->auth->isAuthorized()) {
            // TODO Заменить все эксепшены на логические и обрабатывать их
            throw new \Exception();
        }

        $input_body = @json_decode(file_get_contents('php://input'), true) ?? [];

        $author_id = $this->auth->get('user_id');
        $name = $input_body['name'] ?? null;
        $page_id = (int)($input_body['page_id'] ?? 0) ?: 1;
        $short_des = $input_body['short_des'] ?? null;
        $cover = $input_body['cover'] ?? null;
        $youtube_link = $input_body['youtube_link'] ?? null;
        $description = $input_body['description'] ?? null;

        $lesson_module = new Lessons();
        $new_lesson = $lesson_module->add($author_id, $page_id, $name, $short_des, $cover['id'], $youtube_link, $description);

        return [
            'type' => 'json',
            'data' => $new_lesson
        ];
    }
}