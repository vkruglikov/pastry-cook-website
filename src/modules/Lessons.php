<?php


namespace App\Modules;

use voku\helper\URLify;
const MOCK_PATH = __DIR__ . DIRECTORY_SEPARATOR . 'lessonMocks' . DIRECTORY_SEPARATOR;


class Lessons
{
    function getById(int $id)
    {
        $mock_path = MOCK_PATH . 'lesson_' . $id . '.php';
        $data = @include $mock_path;

        return $data ?? null;
    }

    function lessonByPublicId(int $page_id)
    {
        $db = Db::inst();

        $sql = <<<SQL
        SELECT c.*, i.public as cover_image_public FROM `lessons` as c
        LEFT JOIN images as i ON c.cover_image_id = i.id
        WHERE c.page_id = :page_id
SQL;

        $sth = $db->prepare($sql);
        $sth->execute([
            'page_id' => $page_id
        ]);
        $data = array_map(function ($lesson) {
            return [
                'id' => (int)$lesson['id'],
                'semantic_url' => $lesson['semantic_url'],
                'author_id' => (int)$lesson['author_id'],
                'name' => $lesson['name'],
                'short_description' => $lesson['short_description'],
                'description' => $lesson['description'],
                'cover' => [
                    'id' => (int)$lesson['cover_image_id'],
                    'public' => $lesson['cover_image_public'],
                ],
                'video' => [
                    'id' => $lesson['youtube_video']
                ],
                'date' => strtotime($lesson['date']),
            ];
        }, $sth->fetchAll());

        return $data;
    }

    function lessonByAuthorId(int $author_id)
    {
        $db = Db::inst();

        $sql = <<<SQL
        SELECT c.*, i.public as cover_image_public FROM `lessons` as c
        LEFT JOIN images as i ON c.cover_image_id = i.id
        WHERE c.author_id = :author_id
SQL;

        $sth = $db->prepare($sql);
        $sth->execute([
            'author_id' => $author_id
        ]);
        $data = array_map(function ($lesson) {
            return [
                'id' => (int)$lesson['id'],
                'semantic_url' => $lesson['semantic_url'],
                'author_id' => (int)$lesson['author_id'],
                'name' => $lesson['name'],
                'short_description' => $lesson['short_description'],
                'description' => $lesson['description'],
                'cover' => [
                    'id' => (int)$lesson['cover_image_id'],
                    'public' => $lesson['cover_image_public'],
                ],
                'video' => [
                    'id' => $lesson['youtube_video']
                ],
                'date' => strtotime($lesson['date']),
            ];
        }, $sth->fetchAll());

        return $data;
    }

    function add(int $author_id, int $page_id, $name, $short_des, $cover_image_id, $youtube_link, $description, \DateTime $date = null)
    {
        $db = Db::inst();
        $date = $date ?? new \DateTime();

        if (mb_strlen($name) < 2) {
            throw new \InvalidArgumentException();
        }

        if (!preg_match("/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/", $youtube_link, $youtube_link_matches)) {
            throw new \Exception('Youtube video link');
        }
        $youtube_video_id = $youtube_link_matches[1];

        try {
            $semantic_url = URLify::filter($name);
        } catch (\Exception $exception) {
            $semantic_url = null;
        }

        $data = [
            'semantic_url' => $semantic_url,
            'author_id' => $author_id,
            'page_id' => $page_id,
            'name' => $name,
            'short_description' => $short_des,
            'cover_image_id' => $cover_image_id,
            'youtube_video' => $youtube_video_id,
            'description' => $description,
            'date' => $date->format('Y-m-d H:i:s'),
        ];

        $sql = <<<SQL
            INSERT INTO lessons 
            (semantic_url, author_id, name, short_description, cover_image_id, youtube_video, description, date, page_id) 
            VALUES (:semantic_url, :author_id, :name, :short_description, :cover_image_id, :youtube_video, :description, :date, :page_id)
SQL;

        try {
            $db->beginTransaction();
            $sth = $db->prepare($sql);
            $sth->execute($data);

            $lesson_id = (int)$db->lastInsertId();
            $db->commit();

        } catch (\PDOException $e) {
            $db->rollback();

            throw new \Exception(null, null, $e);
        }

        return $this->getById2($lesson_id);
    }

    function getById2(int $lesson_id)
    {
        $db = Db::inst();

        $sql = <<<SQL
        SELECT c.*, i.public as cover_image_public FROM `lessons` as c
        LEFT JOIN images as i ON c.cover_image_id = i.id
        WHERE c.id = :lesson_id
SQL;

        $sth = $db->prepare($sql);
        $sth->execute([
            'lesson_id' => $lesson_id
        ]);
        $data = $sth->fetch();

        if (empty($data)) {
            return null;
        }

        return [
            'id' => (int)$data['id'],
            'semantic_url' => $data['semantic_url'],
            'author_id' => (int)$data['author_id'],
            'name' => $data['name'],
            'short_description' => $data['short_description'],
            'description' => $data['description'],
            'cover' => [
                'id' => (int)$data['cover_image_id'],
                'public' => $data['cover_image_public'],
            ],
            'video' => [
                'id' => $data['youtube_video']
            ],
            'date' => strtotime($data['date']),
        ];
    }

}