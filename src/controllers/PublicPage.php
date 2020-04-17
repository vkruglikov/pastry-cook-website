<?php

namespace App\Controllers;


use App\Modules\Lessons;
use App\Modules\Users;

class PublicPage extends BasePage
{
    function __construct()
    {
        parent::__construct();
    }

    function create()
    {
        if (!$this->auth->isAuthorized()) {
            $this->redirect('/login');
        }

        return [
            'type' => 'html'
        ];
    }

    function page($params)
    {
        $public_id = (int)$params['public_id'];

        $lessons_module = new Lessons();
        $users_module = new Users();
        $page_module = new \App\Modules\PublicPage();

        $public_data = $page_module->getById($public_id);
        if ($public_data) {
            $user_data = $users_module->getById($public_data['user_id']);

            $author_lessons = array_map(function ($lesson) use ($user_data) {
                return [
                    'id' => $lesson['id'],
                    'authorPhoto' => $user_data['photo'],
                    'semanticUrl' => $lesson['semantic_url'],
                    'title' => $lesson['name'],
                    'subtitle' => $lesson['short_description'],
                    'cover' => $lesson['cover']['public'],
                ];
            }, $lessons_module->lessonByPublicId($public_id));

            $public_data['posts'] = $author_lessons;
        }

        $this->putStoreStateData([
            'public' => [
                $public_id => $public_data
            ]
        ]);

        $this->setMeta([
            'title' => 'Заголовок страницы'
        ]);

        return [
            'type' => 'html'
        ];
    }
}