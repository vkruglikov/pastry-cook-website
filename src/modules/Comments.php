<?php


namespace App\Modules;


class Comments
{

    function getByLessonId(int $lesson_id)
    {
        $db = Db::inst();

        $sql = <<<SQL
        SELECT c.*, u.first_name, u.last_name, u.photo FROM `comments` as c
        INNER JOIN `users` as u ON c.user_id = u.id
        WHERE lesson_id = :lesson_id
        ORDER BY c.date DESC
SQL;

        $sth = $db->prepare($sql);
        $sth->execute([
            'lesson_id' => $lesson_id
        ]);
        $res = $sth->fetchAll();

        return array_map(function ($comment) {
            return [
                'id' => (int)$comment['id'],
                'user_id' => (int)$comment['user_id'],
                'text' => $comment['text'],
                'date' => strtotime($comment['date']),
                'lesson_id' => (int)$comment['lesson_id'],
                'parent_id' => isset($comment['parent_id']) ? (int)$comment['parent_id'] : null,
                'photo' => $comment['photo'],
                'author' => $comment['first_name'] . ' ' . $comment['last_name']
            ];
        }, $res);
    }

    function getById(int $comment_id)
    {
        $db = Db::inst();

        $sql = <<<SQL
        SELECT c.*, u.first_name, u.last_name, u.photo FROM `comments` as c
        INNER JOIN `users` as u ON c.user_id = u.id
        WHERE c.id = :comment_id
SQL;

        $sth = $db->prepare($sql);
        $sth->execute([
            'comment_id' => $comment_id
        ]);
        $comment = $sth->fetch();

        if (empty($comment)) {
            throw new \Exception();
        }

        return [
            'id' => (int)$comment['id'],
            'user_id' => (int)$comment['user_id'],
            'text' => $comment['text'],
            'date' => strtotime($comment['date']),
            'lesson_id' => (int)$comment['lesson_id'],
            'parent_id' => isset($comment['parent_id']) ? (int)$comment['parent_id'] : null,
            'photo' => $comment['photo'],
            'author' => $comment['first_name'] . ' ' . $comment['last_name']
        ];
    }

    function add(string $text, int $user_id, \DateTime $date, int $parent_id = null, int $lesson_id)
    {
        $db = Db::inst();

        if (mb_strlen($text) < 1) {
            throw new \InvalidArgumentException();
        }

        $data = [
            'user_id' => $user_id,
            'date' => $date->format('Y-m-d H:i:s'),
            'text' => $text,
            'parent_id' => $parent_id,
            'lesson_id' => $lesson_id,
        ];

        $sql = <<<SQL
            INSERT INTO comments (user_id, date, text, parent_id, lesson_id) 
            VALUES (:user_id, :date, :text, :parent_id, :lesson_id)
SQL;

        try {
            $db->beginTransaction();
            $sth = $db->prepare($sql);
            $sth->execute($data);

            $comment_id = (int)$db->lastInsertId();
            $db->commit();

        } catch (\PDOException $e) {
            $db->rollback();

            throw new \Exception();
        }

        return $this->getById($comment_id);
    }
}