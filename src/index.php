<?php

require dirname(__DIR__) . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

\Dotenv\Dotenv::createImmutable(dirname(__DIR__))->load();


if (getenv('MODE') === 'DEVELOPMENT') {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}

// TODO привести в порядок роутер
$dispatcher = FastRoute\simpleDispatcher(function (FastRoute\RouteCollector $r) {
    $r->addRoute('GET', '/', [
        'App\\Controllers\\BasePage',
        'index'
    ]);
    $r->addRoute('GET', '/login', [
        'App\\Controllers\\BasePage',
        'login'
    ]);
    $r->addRoute('GET', '/logout', [
        'App\\Controllers\\AuthController',
        'logout'
    ]);
    $r->addRoute('GET', '/login/vk/auth/callback', [
        'App\\Controllers\\AuthController',
        'vkCallback'
    ]);
    $r->addRoute('GET', '/login/vk/auth', [
        'App\\Controllers\\AuthController',
        'vk'
    ]);
    $r->addRoute('GET', '/login/google/auth', [
        'App\\Controllers\\AuthController',
        'google'
    ]);
    $r->addRoute('GET', '/login/google/auth/callback', [
        'App\\Controllers\\AuthController',
        'googleCallback'
    ]);
    $r->addRoute('GET', '/login/facebook/auth/callback', [
        'App\\Controllers\\AuthController',
        'facebookCallback'
    ]);
    $r->addRoute('GET', '/login/facebook/auth', [
        'App\\Controllers\\AuthController',
        'facebook'
    ]);
    $r->addRoute('GET', '/lesson/add', [
        'App\\Controllers\\LessonPage',
        'add'
    ]);
    $r->addRoute('GET', '/public{public_id:\d+}[{semantic_url}]', [
        \App\Controllers\PublicPage::class,
        'page'
    ]);
    $r->addRoute('GET', '/public/create', [
        \App\Controllers\PublicPage::class,
        'create'
    ]);
    $r->addRoute('POST', '/public', [
        \App\Controllers\PublicController::class,
        'post'
    ]);
    $r->addRoute('POST', '/lesson', [
        \App\Controllers\LessonController::class,
        'post'
    ]);
    $r->addRoute('POST', '/upload/image', [
        'App\\Controllers\\UploadImageController',
        'upload'
    ]);
    $r->addRoute('GET', '/lesson/{lessonId:\d+}[{semantic_url}]', [
        'App\\Controllers\\LessonPage',
        'lesson'
    ]);
    $r->addRoute('GET', '/author/noisy_breeze', [
        'App\\Controllers\\AuthorPage',
        'author'
    ]);
    $r->addRoute('GET', '/comments/lesson/{lessonId:\d+}', [
        'App\\Controllers\\Comments',
        'getByLesson'
    ]);
    $r->addRoute('POST', '/comments/add/lesson/{lessonId:\d+}', [
        'App\\Controllers\\Comments',
        'postLessonComment'
    ]);
    $r->addRoute('POST', '/subscribe', [
        'App\\Controllers\\Subscribe',
        'post'
    ]);
    $r->addRoute('POST', '/rate', [
        'App\\Controllers\\Rate',
        'post'
    ]);
});

$uri = $_SERVER['REQUEST_URI'];
if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}

$routeInfo = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], rawurldecode($uri));

switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $args = $routeInfo[2];

        $controller = new $handler[0];

        $result = call_user_func(array($controller, $handler[1]), $args);

        if (isset($result['type']) && $result['type'] === 'json') {
            header('Content-Type: application/json');
            if (isset($result['data'])) {
                print json_encode($result['data']);
            }

        } elseif (isset($result['type']) && $result['type'] === 'html') {
            /**
             * @var $controller \App\Controllers\BasePage
             */
            $static_data = $controller->static_data;
            $store_state = $controller->store_state;
            $meta_data = $controller->meta_data;

            require __DIR__ . DIRECTORY_SEPARATOR . 'templates' . DIRECTORY_SEPARATOR . 'pageLayout.php';
        }
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
    case FastRoute\Dispatcher::NOT_FOUND:
    default:
        header('Location: /404.html');
        exit();
        break;
}