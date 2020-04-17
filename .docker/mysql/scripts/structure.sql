
START TRANSACTION;

--
-- База данных: `main`
--

-- --------------------------------------------------------

--
-- Структура таблицы `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `text` text NOT NULL,
  `date` timestamp NOT NULL,
  `lesson_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `comments`
--

-- INSERT INTO `comments` (`id`, `user_id`, `text`, `date`, `lesson_id`, `parent_id`) VALUES
-- (3, 9, 'привет', '2020-04-22 19:04:44', 1, NULL),
-- (4, 9, 'Оставляю тестовый комментарий', '2020-04-22 19:04:45', 1, NULL),
-- (5, 9, 'оставляю тестовый коммент', '2020-04-22 19:04:45', 1, NULL),
-- (6, 9, 'Оставь коммент', '2020-04-22 19:04:49', 1, NULL),
-- (7, 9, 'Привет', '2020-04-22 19:04:51', 1, NULL),
-- (8, 9, 'Привов', '2020-04-22 19:04:51', 1, NULL),
-- (9, 9, 'asdasd', '2020-04-22 19:04:52', 1, NULL),
-- (10, 9, 'ftyrtyrtyrtyrtyrtyrty', '2020-04-22 19:04:52', 1, NULL),
-- (11, 9, 'sdfsdf', '2020-04-22 19:04:54', 1, NULL),
-- (12, 9, 'sfdsf', '2020-04-22 19:04:59', 1, NULL),
-- (13, 9, '222222222222', '2020-04-22 19:04:59', 1, NULL),
-- (14, 9, 'dfg345', '2020-04-22 19:04:59', 1, NULL),
-- (15, 9, 'Fhdhdhjdjdjdjd', '2020-04-22 20:04:01', 1, NULL),
-- (16, 9, 'Fhdhdhjdjdjdjd', '2020-04-22 20:04:01', 1, NULL),
-- (17, 9, 'Fhdhdhjdjdjdjd', '2020-04-22 20:04:01', 1, NULL),
-- (18, 9, 'Fhdhdhjdjdjdjd', '2020-04-22 20:04:01', 1, NULL),
-- (19, 9, 'Fhdhdhjdjdjdjd', '2020-04-22 20:04:01', 1, NULL),
-- (20, 9, '1111777777711111', '2020-04-22 20:04:02', 1, NULL),
-- (21, 10, 'ghbd', '2020-04-22 20:04:06', 1, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `first_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8_general_ci NOT NULL,
  `last_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8_general_ci NOT NULL,
  `date_reg` timestamp NOT NULL,
  `photo` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8_general_ci NOT NULL,
  `social_vk_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `users`
--

-- INSERT INTO `users` (`id`, `first_name`, `last_name`, `date_reg`, `photo`, `social_vk_id`) VALUES
-- (9, 'Валентин', 'Кругликов', '2020-04-22 18:04:59', 'https://sun9-18.userapi.com/c854320/v854320583/cc5bb/a4jadIswaNk.jpg?ava=1', 251624178),
-- (10, 'Оксана', 'Федорова', '2020-04-22 20:04:06', 'https://sun9-42.userapi.com/c853524/v853524227/da3ab/ZXpeoZZ-Dpo.jpg?ava=1', 21770666);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;