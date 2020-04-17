<?php

namespace App\Controllers;

use App\Modules\Lessons;

class AuthorPage extends BasePage
{
    function __construct()
    {
        parent::__construct();
    }

    public function author()
    {
        $author = 'noisy_breeze';
        $author_id = 11;

        $lessons_module = new Lessons();

        $author_lessons = array_map(function ($lesson) {
            return [
                'id' => $lesson['id'],
                'semanticUrl' => $lesson['semantic_url'],
                'title' => $lesson['name'],
                'subtitle' => $lesson['short_description'],
                'cover' => $lesson['cover']['public'],
            ];
        }, $lessons_module->lessonByAuthorId($author_id));

        $author_data = [
            'nickname' => $author,
            'author_id' => $author_id,
            'first_name' => 'Оксана',
            'last_name' => 'Федорова',
            'photo' => 'https://sun9-22.userapi.com/impf/c853524/v853524227/da3a7/WSIX8gHYkbE.jpg?size=400x0&quality=90&sign=1c3080ff97b47a3c38a0d6c77193e8da',
            'title' => 'Кондитерские уроки Федоровой Оксаны',
            'subtitle' => 'Всем привет! Я Федорова Оксана, и кондитер! На этой странице я буду выкладывать свои видеоуроки. подписывайся ☺️',
            'lessons' => $author_lessons,
        ];

        $this->putStoreStateData([
            'authors' => [
                $author_id => $author_data
            ]
        ]);

        $this->setMeta([
            'title' => $author_data['title']
        ]);

        return [
            'type' => 'html'
        ];
    }

}