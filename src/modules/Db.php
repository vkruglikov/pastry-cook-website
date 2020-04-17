<?php


namespace App\Modules;


class Db
{
    /**
     * @var \PDO
     */
    public $pdo;
    static private $instance;

    static function inst()
    {
        return static::$instance ?? static::$instance = new Db();
    }

    function beginTransaction()
    {
        $this->connect();
        return $this->pdo->beginTransaction();
    }

    function commit()
    {
        $this->connect();
        return $this->pdo->commit();
    }

    function rollBack()
    {
        $this->connect();
        return $this->pdo->rollBack();
    }

    function lastInsertId()
    {
        $this->connect();
        return $this->pdo->lastInsertId();
    }

    function connect()
    {
        if ($this->pdo) return;

        $host = getenv('DATABASE_HOST');
        $port = getenv('DATABASE_PORT');
        $db = getenv('DATABASE_NAME');
        $user = getenv('DATABASE_USER');
        $pass = getenv('DATABASE_PASS');
        $charset = getenv('DATABASE_CHARSET');

        $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
        $opt = [
            \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
        ];
        $this->pdo = new \PDO($dsn, $user, $pass, $opt);
    }

    function prepare()
    {
        $this->connect();
        return call_user_func_array([
            $this->pdo,
            'prepare'
        ], func_get_args());
    }
}