<?php

namespace App\Controllers;


use App\Modules\Lessons;

class LessonPage extends BasePage
{
    function __construct()
    {
        parent::__construct();
    }

    function add()
    {
        if (!$this->auth->isAuthorized()) {
            $this->redirect('/login');
        }

        return [
            'type' => 'html'
        ];
    }

    public function lesson($params)
    {
        $lesson_id = (int)$params['lessonId'];
        if (!$lesson_id) {
            $this->redirect('/');
        }

        $lessons_module = new Lessons();
        $lesson_data = $lessons_module->getById2($lesson_id);

        if (!$lesson_data) {
            return [
                'type' => 'html',
            ];
        }

        $comments_module = new \App\Modules\Comments();
        try {
            $comments = $comments_module->getByLessonId($lesson_id);
        } catch (\Exception $exception) {
            $comments = [];
        }

        $state_comments = array_map(function ($comment) {
            return [
                'id' => $comment['id'],
                'parentId' => $comment['parent_id'],
                'lessonId' => $comment['lesson_id'],
                'author' => $comment['author'],
                'date' => $comment['date'],
                'text' => $comment['text'],
                'photo' => $comment['photo'],
            ];
        }, $comments);

        $lesson_data['comments'] = $state_comments;

        $this->putStoreStateData([
            'lessons' => [
                $lesson_id => $lesson_data
            ],
        ]);

        $this->setMeta([
            'title' => $lesson_data['name'] . ' | pastry-cook.ru'
        ]);

        return [
            'type' => 'html'
        ];
    }

}