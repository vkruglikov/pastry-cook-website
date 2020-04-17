<?php


namespace App\Controllers;


class Comments extends SessionAbstractController
{
    function getByLesson($params)
    {
        $lessonId = (int)$params['lessonId'];

        $comments_model = new \App\Modules\Comments();
        $comments = $comments_model->getByLessonId($lessonId);

        return [
            'type' => 'json',
            'data' => $comments
        ];
    }

    function postLessonComment($params)
    {
        if (!$this->auth->isAuthorized()) {
            throw new \Exception();
        }
        $comments_model = new \App\Modules\Comments();

        $lessonId = (int)$params['lessonId'];
        $input_body = @json_decode(file_get_contents('php://input'), true) ?? [];

        $lesson_id = $lessonId;
        $text = $input_body['text'] ?? '';
        $parent_id = isset($input_body['parent_id']) ? (int)$input_body['parent_id'] : null;
        $user_id = $this->auth->getAuthData()['user_id'];
        $date = new \DateTime();

        $comment_id = $comments_model->add($text, $user_id, $date, $parent_id, $lesson_id);

        return [
            'type' => 'json',
            'data' => [
                'comment' => $comment_id
            ]
        ];
    }
}