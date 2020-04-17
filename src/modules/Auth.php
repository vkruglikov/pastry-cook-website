<?php

namespace App\Modules;

class Auth
{
    function isAuthorized()
    {
        return isset($_SESSION['auth'], $_SESSION['auth']['login']) && $_SESSION['auth']['login'] === true;
    }

    function logout()
    {
        unset($_SESSION['auth']);
    }

    function setAuthData($data)
    {
        // TODO прибрать этот пиздец с social_id
        $_SESSION['auth'] = [
            'login' => true,
            'user_id' => (int)$data['user_id'],
            'social_vk_id' => $data['social_vk_id'] ?? null,
            'social_fb_id' => $data['social_fb_id'] ?? null,
            'social_google_id' => $data['social_google_id'] ?? null,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'photo' => $data['photo'],
        ];
    }

    function get($key)
    {
        return $this->getAuthData()[$key];
    }

    function getAuthData()
    {
        return $_SESSION['auth'] ?? null;
    }

    function socialAuthUrls()
    {
        $is_https = getenv('MODE') !== 'DEVELOPMENT';

        return [
            'vk' => 'https://oauth.vk.com/authorize?client_id='
                . getenv('VK_API_CLIENT_ID') . '&display=popup&redirect_uri='
                . ($is_https ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/login/vk/auth/callback'
                . '&scope=friends&response_type=code&v=5.103',
        ];
    }
}