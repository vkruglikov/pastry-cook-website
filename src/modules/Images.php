<?php

namespace App\Modules;

use Intervention\Image\ImageManager;

class Images
{
    function add(int $user_id, string $path_to_image, array $crop = null, array $resize = null, \DateTime $date = null)
    {
        $date = $date ?? new \DateTime();

        try {
            $image_manager = new ImageManager(array('driver' => 'imagick'));
            $image = $image_manager->make($path_to_image);

            if ($crop) {
                $image = $image->crop((int)$crop['width'], (int)$crop['height'], (int)$crop['x'], (int)$crop['y']);
            }

            if ($resize) {
                $image = $image->resize((int)$resize['width'], (int)$resize['height']);
            }

            $public_path = DIRECTORY_SEPARATOR . 'upload' . DIRECTORY_SEPARATOR . 'img';
            $path_to_save = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'www' . $public_path;
            $file_name = md5(microtime()) . $user_id . '.jpg';

            if (!is_writable($path_to_save)) {
                mkdir($path_to_save, 0777, true);
            }
            $image->save($path_to_save . DIRECTORY_SEPARATOR . $file_name, 80, 'jpg');

            $data = [
                'user_id' => $user_id,
                'date' => $date->format('Y-m-d H:i:s'),
                'public' => $public_path . DIRECTORY_SEPARATOR . $file_name,
                'path' => $path_to_save . DIRECTORY_SEPARATOR . $file_name,
            ];
        } catch (\Exception $exception) {
            throw new \Exception(null, null, $exception);
        }

        $db = Db::inst();
        try {

            $sql = <<<SQL
            INSERT INTO images (user_id, date, public, path) 
            VALUES (:user_id, :date, :public, :path)
SQL;

            $db->beginTransaction();
            $sth = $db->prepare($sql);
            $sth->execute($data);

            $image_id = (int)$db->lastInsertId();
            $db->commit();

            return $this->getById($image_id);
        } catch (\Exception $exception) {
            $db->rollback();

            throw new \Exception(null, null, $exception);
        }
    }


    function getById(int $image_id)
    {
        $db = Db::inst();

        $sql = <<<SQL
        SELECT c.* FROM `images` as c
        WHERE c.id = :image_id
SQL;

        $sth = $db->prepare($sql);
        $sth->execute([
            'image_id' => $image_id
        ]);
        $data = $sth->fetch();

        return !empty($data) ? [
            'id' => (int)$data['id'],
            'user_id' => (int)$data['user_id'],
            'path' => $data['path'],
            'public' => $data['public'],
            'date' => strtotime($data['date']),
        ] : null;
    }
}