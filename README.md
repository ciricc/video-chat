# (RUS)

# Видео чат на NodeJS с помощью hls.js
Это простой проект, который показывает как можно воспользоваться модулем socket.io для создания быстрого чата и как применима библиотека hls.js.

# Как это запускать?
Все, что вам нужно сделать - это:

1) Клонировать данный репозиторий себе на компьютер

```
git clone https://github.com/ciricc/video-chat.git
```

2) Установить [NodeJS](https://nodejs.org)

3) Написать следующие команды

```
cd video-chat
npm install
node index.js
```

4) Зайти на http://127.0.0.1:5000

В случае если видеj трансляция не работает, зайдите в ВRонтакте и найдите лю,ую трансляцию. Откройте ее, затем нажмите ПКМ по ней. Выберите "Копировать данные для диагностики", после чего достаньте из этих данных ссылку на HLS. Эту ссылку вам нужно будет поставить в public/js/main.js первым параметром метода ```video_stream__init()``` объекта ```IO_LISTENER```
После чего, перезагрузите страницу. Если вновь не работает, обновите браузер до более новой версии.

Это мой первый опыт, я полностью новичек в программировании, поэтому, код не лучшего вида. Пример не является эталоном, вы можете написать лучше. Все файлы других библиотек/проектов распространялись по лицензии MIT и внутри них указаны авторы.

Приятного стриминга!


# (EN) (Google translate)

# Video chat on NodeJS using hls.js
This is a simple project that shows how you can use the socket.io module to create a quick chat and how the hls.js library works.

# How does it run?
All you need to do is:

1) Clone this repository on your computer

```
git clone https://github.com/ciricc/video-chat.git
```

2) Install [NodeJS](https://nodejs.org)

3) Write the following commands

```
cd video-chat
npm install
node index.js
```

4) Go to http://127.0.0.1:5000

In case the broadcast does not work, go to Vkontakte and find the live broadcast. Open it, then press RMB on it. Select Copy data for diagnostics, and then extract the HLS reference from this data. Main.js first parameterrom method ```video_stream__init ()``` object ```IO_LISTENER```
After that, reload the page. If it does not work again, update your browser.

This is my first experience, I'm completely new to programming, therefore, the code is not the best kind. An example is not a standard, you can write better. All files of other libraries / projects are distributed under the MIT license and within them authors are indicated.

Have a nice streaming!

