<?php

$static_data = isset($static_data) ? $static_data : [];
$store_state = isset($store_state) ? $store_state : [];
$meta_data = isset($meta_data) ? $meta_data : [];

$js_manifest = @json_decode(file_get_contents(dirname(__DIR__, 2) . '/www/static/manifest.json'), true);
$js_manifest = $js_manifest ?? [];

?><!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title><?php print $meta_data['title']; ?></title>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <!--    <link rel="manifest" href="/site.webmanifest">-->
</head>
<body>
<div id="root"></div>
<script type="text/javascript">
    window.staticData = <?php print json_encode($static_data) ?>;
    window.storeState = <?php print json_encode($store_state) ?>;
</script>
<script type="text/javascript" src="<?php print $js_manifest['main.js'] ?>"></script>
<script type="text/javascript" src="<?php print $js_manifest['vendors.js'] ?>"></script>
</body>
</html>