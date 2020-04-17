<?php

namespace App\Controllers;


use App\Modules\Users;
use Facebook\Facebook;
use VK\Client\VKApiClient;

function printPopupTemplate($type, $data)
{
    require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'templates' . DIRECTORY_SEPARATOR . 'popupAuth.php';
}

class AuthController extends SessionAbstractController
{
    function google()
    {
        $is_https = getenv('MODE') !== 'DEVELOPMENT';

        // init configuration
        $clientID = getenv('GOOGLE_API_ID');
        $clientSecret = getenv('GOOGLE_API_SECRET');
        $redirectUri = ($is_https ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/login/google/auth/callback';

        // create Client Request to access Google API
        $client = new \Google_Client();
        $client->setClientId($clientID);
        $client->setClientSecret($clientSecret);
        $client->setRedirectUri($redirectUri);
        $client->addScope("email");
        $client->addScope("profile");

        $this->redirect($client->createAuthUrl());
    }

    function googleCallback()
    {
        try {
            $is_https = getenv('MODE') !== 'DEVELOPMENT';

            // init configuration
            $clientID = getenv('GOOGLE_API_ID');
            $clientSecret = getenv('GOOGLE_API_SECRET');
            $redirectUri = ($is_https ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/login/google/auth/callback';

            $client = new \Google_Client();
            $client->setClientId($clientID);
            $client->setClientSecret($clientSecret);
            $client->setRedirectUri($redirectUri);
            $client->addScope("email");
            $client->addScope("profile");

            $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
            $client->setAccessToken($token['access_token']);

            // get profile info
            $google_oauth = new \Google_Service_Oauth2($client);
            $social_user_info = $google_oauth->userinfo->get();

            $user_module = new Users();
            $local_user_info = $user_module->socialLogin(
                $social_user_info['givenName'],
                $social_user_info['familyName'],
                $social_user_info['picture'],
                [
                    'social_google_id' => $social_user_info['id'],
                ]
            );

            if ($local_user_info) {
                $this->auth->setAuthData([
                    'user_id' => $local_user_info['id'],
                    'social_google_id' => $local_user_info['social_google_id'],
                    'first_name' => $local_user_info['first_name'],
                    'last_name' => $local_user_info['last_name'],
                    'photo' => $local_user_info['photo'],
                ]);
            }
        } catch (\Exception $exception) {
            //
        }

        $state = @json_decode($_GET['state'], true) ?? [];
        $target = $state['target'] ?? '/';
        $display = $state['display'] ?? 'popup';

        if ($display === 'popup') {
            printPopupTemplate($this->auth->isAuthorized() ? 'success' : 'fail', $this->auth->getAuthData());
        } else {
            $this->redirect($target);
        }
    }

    function facebook()
    {
        $is_https = getenv('MODE') !== 'DEVELOPMENT';

        unset($_SESSION['FBRLH_state']);

        $fb = new Facebook([
            'app_id' => getenv('FB_API_APP_ID'),
            'app_secret' => getenv('FB_API_APP_SECRET'),
            'default_graph_version' => 'v2.6',
        ]);
        $helper = $fb->getRedirectLoginHelper();

        $loginUrl = $helper->getLoginUrl(($is_https ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/login/facebook/auth/callback');

        $this->redirect($loginUrl);
    }

    function facebookCallback()
    {
        try {
            if ($this->auth->isAuthorized()) {
                throw new \Exception();
            }

            if (isset($_GET['error_code'])) {
                throw new \Exception();
            }

            $fb = new Facebook([
                'app_id' => getenv('FB_API_APP_ID'),
                'app_secret' => getenv('FB_API_APP_SECRET'),
                'default_graph_version' => 'v2.6',
            ]);

            $helper = $fb->getRedirectLoginHelper();

            $accessToken = $helper->getAccessToken();

            if (!$accessToken) {
                throw new \Exception();
            }

            $response = $fb->get('/me?fields=id,picture,first_name,last_name', $accessToken->getValue());

            $social_user_info = $response->getDecodedBody();

            $user_module = new Users();
            $local_user_info = $user_module->socialLogin(
                $social_user_info['first_name'],
                $social_user_info['last_name'],
                $social_user_info['picture']['data']['url'],
                [
                    'social_fb_id' => $social_user_info['id'],
                ]
            );

            if ($local_user_info) {
                $this->auth->setAuthData([
                    'user_id' => $local_user_info['id'],
                    'social_fb_id' => $local_user_info['social_fb_id'],
                    'first_name' => $local_user_info['first_name'],
                    'last_name' => $local_user_info['last_name'],
                    'photo' => $local_user_info['photo'],
                ]);
            }

        } catch (\Exception $e) {
            //
        }

        $state = @json_decode($_GET['state'], true) ?? [];
        $target = $state['target'] ?? '/';
        $display = $state['display'] ?? 'popup';

        if ($display === 'popup') {
            printPopupTemplate($this->auth->isAuthorized() ? 'success' : 'fail', $this->auth->getAuthData());
        } else {
            $this->redirect($target);
        }
    }

    function vk()
    {
        $state = $_GET['state'] ?? '';

        $this->redirect($this->auth->socialAuthUrls()['vk'] . '&state=' . $state);
    }

    function vkCallback()
    {
        $code = $_GET['code'] ?? null;
        $error = $_GET['error'] ?? null;


        if (!$this->auth->isAuthorized() && $code && !$error) {
            $vk = new VKApiClient();
            $user_module = new Users();

            $is_https = getenv('MODE') !== 'DEVELOPMENT';

            $oauth = new \VK\OAuth\VKOAuth();
            $client_id = getenv('VK_API_CLIENT_ID');
            $client_secret = getenv('VK_API_CLIENT_SECRET');
            $redirect_uri = ($is_https ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/login/vk/auth/callback';

            $response = $oauth->getAccessToken($client_id, $client_secret, $redirect_uri, $code);
            $social_user_info = $vk->users()->get($response['access_token'], [
                'fields' => 'photo_50'
            ])[0];

            $local_user_info = $user_module->socialLogin(
                $social_user_info['first_name'],
                $social_user_info['last_name'],
                $social_user_info['photo_50'],
                [
                    'social_vk_id' => $social_user_info['id'],
                ]
            );

            if ($local_user_info) {
                $this->auth->setAuthData([
                    'user_id' => $local_user_info['id'],
                    'social_vk_id' => $local_user_info['social_vk_id'],
                    'first_name' => $local_user_info['first_name'],
                    'last_name' => $local_user_info['last_name'],
                    'photo' => $local_user_info['photo'],
                ]);
            }
        }

        $state = @json_decode($_GET['state'], true) ?? [];

        $target = $state['target'] ?? '/';
        $display = $state['display'] ?? null;

        if ($display === 'popup') {
            printPopupTemplate($this->auth->isAuthorized() ? 'success' : 'fail', $this->auth->getAuthData());
        } else {
            $this->redirect($target);
        }
    }

    function logout()
    {
        $this->auth->logout();
        $this->redirect('/');
    }

}