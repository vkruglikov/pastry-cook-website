<?php

namespace App\Modules;


class Users
{

    function getById($id)
    {
        $db = Db::inst();

        // TODO Сделать метод в DB prepare с типами
        $sth = $db->prepare('
            SELECT * FROM `users` 
            WHERE id = :user_id
            ');

        $sth->execute([
            'user_id' => $id
        ]);

        $res = $sth->fetchAll();

        return empty($res) ? null : [
            'id' => (int)$res[0]['id'],
            'social_vk_id' => isset($res[0]['social_vk_id']) ? (int)$res[0]['social_vk_id'] : null,
            'social_fb_id' => isset($res[0]['social_fb_id']) ? (int)$res[0]['social_fb_id'] : null,
            'social_google_id' => isset($res[0]['social_fb_id']) ? (int)$res[0]['social_google_id'] : null,
            'first_name' => $res[0]['first_name'],
            'last_name' => $res[0]['last_name'],
            'photo' => $res[0]['photo'],
        ];
    }

    function getBySocial($predicate)
    {
        $db = Db::inst();

        // TODO Сделать метод в DB prepare с типами
        $sth = $db->prepare('
            SELECT * FROM `users` 
            WHERE 1=1 
            ' . (isset($predicate['social_vk_id']) ? 'AND social_vk_id = :social_vk_id ' : ' ') . '
            ' . (isset($predicate['social_fb_id']) ? 'AND social_fb_id = :social_fb_id ' : ' ') . '
            ' . (isset($predicate['social_google_id']) ? 'AND social_google_id = :social_google_id ' : ' ') . '
        ');

        $sth->execute(array_filter([
            'social_vk_id' => $predicate['social_vk_id'] ?? null,
            'social_fb_id' => $predicate['social_fb_id'] ?? null,
            'social_google_id' => $predicate['social_google_id'] ?? null
        ], function ($item) {
            return !!$item;
        }));

        $res = $sth->fetchAll();

        return empty($res) ? null : [
            'id' => (int)$res[0]['id'],
            'social_vk_id' => isset($res[0]['social_vk_id']) ? (int)$res[0]['social_vk_id'] : null,
            'social_fb_id' => isset($res[0]['social_fb_id']) ? (int)$res[0]['social_fb_id'] : null,
            'social_google_id' => isset($res[0]['social_fb_id']) ? (int)$res[0]['social_google_id'] : null,
            'first_name' => $res[0]['first_name'],
            'last_name' => $res[0]['last_name'],
            'photo' => $res[0]['photo'],
        ];
    }

    function socialLogin($first_name, $last_name, $photo, array $social_ids)
    {
        $user_info = $this->getBySocial($social_ids);

        if (!$user_info) {
            $user_id = $this->add($first_name, $last_name, new \DateTime(), $photo, $social_ids);

            if (!$user_id) {
                throw new \Exception();
            }

            $user_info = $this->getBySocial($social_ids);
        }

        return $user_info;
    }

    function add($first_name, $last_name, \DateTime $date_reg, $photo, array $social_ids = [])
    {
        $db = Db::inst();

        $data = [
            'first_name' => $first_name,
            'last_name' => $last_name,
            'date_reg' => $date_reg->format('Y-m-d H:m:i'),
            'photo' => $photo,
            'social_vk_id' => $social_ids['social_vk_id'] ?? null,
            'social_fb_id' => $social_ids['social_fb_id'] ?? null,
            'social_google_id' => $social_ids['social_google_id'] ?? null
        ];

        $sql = <<<SQL
            INSERT INTO users (first_name, last_name, date_reg, photo, social_vk_id, social_fb_id, social_google_id) 
            VALUES (:first_name, :last_name, :date_reg, :photo, :social_vk_id, :social_fb_id, :social_google_id)
SQL;
        try {
            $db->beginTransaction();
            $sth = $db->prepare($sql);
            $sth->execute($data);

            $user_id = (int)$db->lastInsertId();
            $db->commit();

            return $user_id;
        } catch (\PDOException $e) {
            $db->rollback();

            return false;
        }
    }
}