<?php


namespace App\Modules;


class PublicPage
{
    function add(int $user_id, string $title, string $subtitle = null, $cover_image_id, \DateTime $date = null)
    {
        $db = Db::inst();
        $date = $date ?? new \DateTime();

        $data = [
            'user_id' => $user_id,
            'title' => $title,
            'subtitle' => $subtitle,
            'cover_image_id' => $cover_image_id,
            'date' => $date->format('Y-m-d H:i:s'),
        ];

        $sql = <<<SQL
            INSERT INTO public_page 
            (user_id, title, subtitle, cover_image_id, date) 
            VALUES (:user_id, :title, :subtitle, :cover_image_id, :date)
SQL;

        try {
            $db->beginTransaction();
            $sth = $db->prepare($sql);
            $sth->execute($data);

            $page_id = (int)$db->lastInsertId();
            $db->commit();

        } catch (\PDOException $e) {
            $db->rollback();

            throw new \Exception(null, null, $e);
        }

        return $this->getById($page_id);
    }

    function getById(int $page_id)
    {
        $db = Db::inst();

        $sql = <<<SQL
        SELECT p.*, i.public as cover_image_public FROM `public_page` as p
        LEFT JOIN images as i ON p.cover_image_id = i.id
        WHERE p.id = :page_id
SQL;

        $sth = $db->prepare($sql);
        $sth->execute([
            'page_id' => $page_id
        ]);
        $data = $sth->fetch();

        if (empty($data)) {
            return null;
        }

        return [
            'id' => (int)$data['id'],
            'user_id' => (int)$data['user_id'],
            'title' => $data['title'],
            'subtitle' => $data['subtitle'],
            'cover_image_url' => $data['cover_image_public'],
        ];
    }
}