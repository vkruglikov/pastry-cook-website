<?php
$type = $type ?? null;
$data = $data ?? null;
?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Авторизация</title>
</head>
<body>
<script type="text/javascript">
    window.authResultType = <?php print json_encode($type) ?>;
    window.authResultData = <?php print json_encode($data) ?>;
    window.opener.postMessage('<?php print json_encode([
        'type' => 'authPostFromPopupAuth',
        'result' => $type,
        'data' => $data,
    ]) ?>', '*');
</script>
</body>
</html>