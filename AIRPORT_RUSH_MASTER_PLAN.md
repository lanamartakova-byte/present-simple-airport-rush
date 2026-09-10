# AIRPORT RUSH --- MASTER PLAN / ТЗ ДЛЯ CODEX

## 1. Общая концепция

Создать интерактивную браузерную образовательную игру **AIRPORT RUSH ---
Don't Miss Your Flight!**

Целевая аудитория: взрослые Beginner / Elementary (A1--A2).

Грамматика: Present Simple: - affirmative; - negative; - questions.

Три независимые мини-игры: 1. CHECK-IN --- Affirmative 2. SECURITY ---
Negative 3. FIND YOUR GATE --- Questions

Все три доступны с HOME в любом порядке. GAME 3 заканчивается визуальной
наградой FINAL CALL. Очков, best score, accuracy, рейтинга и подсчёта
ошибок нет.

## 2. Техническая основа

Лёгкое статическое приложение: HTML + CSS + vanilla JavaScript.

Требования: - работает локально; - совместимо с GitHub Pages и обычным
статическим хостингом; - работает в Genially через iframe; - только
относительные пути к assets; - никаких hard-coded production/GitHub
URLs; - без backend, базы данных и регистрации; - responsive, основной
формат 16:9; - desktop/laptop first; - без тяжёлых frameworks; - вопросы
хранить отдельно от основной логики, чтобы легко редактировать.

## 3. Оптимизация

-   Исходные изображения сейчас используются в PNG; не переименовывать и не конвертировать их самовольно во время основной сборки.
-   Не использовать GIF/video, если движение можно сделать CSS/JS.
-   Основные анимации: transform, translate, scale, opacity.
-   Не загружать тяжёлые ненужные assets заранее.
-   Переиспользовать элементы.
-   Исходные audio assets уже подготовлены: background music в MP3, короткие SFX преимущественно в WAV.
-   Во время основной сборки использовать реальные существующие файлы как есть.
-   Финальную оптимизацию веса выполнять отдельным этапом после того, как вся игра собрана и протестирована.
-   На финальном этапе проверить размеры PNG/WAV/MP3 и оптимизировать только действительно тяжёлые assets без заметной потери качества; после любых конвертаций обновить пути и повторно протестировать игру.
-   Проект должен оставаться лёгким для GitHub Pages, обычного статического хостинга и Genially iframe.

## 4. Визуальный стиль

Единый стиль всей игры: **high-quality realistic illustration, NOT
photography**.

Современный международный аэропорт; взрослая, стильная, чистая эстетика.
Не делать детскую cartoon-game стилистику.

Можно использовать pseudo-3D, 3/4 view или side view там, где это лучше
выглядит. Ракурс может меняться между сценами, но персонажи, освещение,
палитра и уровень реалистичности должны быть едиными.

## 5. HOME

Заголовок: **AIRPORT RUSH** **Don't Miss Your Flight!**

Departure board: - FLIGHT AR725 - LONDON - 18:45 - GATE B24

Три всегда активные зоны: - CHECK-IN --- Affirmative - SECURITY ---
Negative - FIND YOUR GATE --- Questions

Никаких замков. GAME 2 и GAME 3 не требуют прохождения предыдущих.

Не сохранять completed state между сессиями через localStorage/cookies.

## 6. Постоянная навигация и звук

На протяжении всей игры должны быть доступны:
- HOME;
- отдельный Music volume + mute/unmute;
- отдельный SFX volume + mute/unmute.

Контролы компактные и не перекрывают задания.

Все аудиофайлы уже подготовлены и находятся в:

```text
assets/
  sounds/
```

Использовать существующие файлы точно с этими именами:

```text
assets/sounds/
  background_music.mp3
  correct.wav
  wrong.wav
  click.wav
  airport_ding.wav
  reward.wav
  seatbelt.wav
  takeoff.wav
```

Не переименовывать и не заменять эти файлы без отдельного указания пользователя.

Назначение:
- `background_music.mp3` — постоянная фоновая музыка;
- `correct.wav` — правильный ответ;
- `wrong.wav` — неправильный ответ;
- `click.wav` — UI-клики;
- `airport_ding.wav` — airport/departure announcement cue, в том числе перед FINAL CALL;
- `reward.wav` — появление Boarding Pass / награда;
- `seatbelt.wav` — финальная авиационная часть;
- `takeoff.wav` — взлёт самолёта в FINAL CALL.

Начальные уровни громкости:
- Music = `0.20`;
- SFX = `0.40`.

Music и SFX регулируются независимо. Не изменять исходные audio files ради громкости — управлять уровнем программно через JavaScript.

Для фоновой музыки сделать мягкий fade-in примерно 0.8–1 секунду, чтобы она не включалась резко.

Учитывать browser autoplay restrictions: запуск музыки должен корректно происходить после первого пользовательского взаимодействия, если браузер блокирует autoplay.

Отсутствие/ошибка отдельного аудиофайла не должны ломать игру.

## 7. Жизни

Каждая мини-игра начинается с ❤️❤️❤️.

При ошибке: 1. INCORRECT / TRY AGAIN; 2. SFX ошибки после его
добавления; 3. −1 жизнь; 4. правильный ответ НЕ показывать; 5. подсказок
НЕ давать; 6. остаётся то же задание.

Переход дальше только после правильного ответа.

После третьей ошибки текущая мини-игра автоматически перезапускается с
задания №1 и снова с 3 жизнями. Остальные мини-игры не затрагиваются.

## 8. YOUR JOURNEY

Это сюжетный, а НЕ сохранённый пользовательский прогресс.

Панель: - BOARDING PASS - SECURITY - GATE B24

GAME 1: - Boarding Pass = current - Security/Gate = future

GAME 2: - Boarding Pass ✓ уже получен независимо от того, играл ли
пользователь GAME 1 - Security = current - Gate = future

GAME 3: - Boarding Pass ✓ - Security ✓ - Gate B24 = current

Это должно выглядеть так даже на новом компьютере при первом запуске.

## 9. GAME 1 --- CHECK-IN

Present Simple affirmative. 20 заданий.

Механика: check-in area + движущийся baggage conveyor. Три варианта
ответа находятся на трёх чемоданах, которые подъезжают по ленте. Игрок
кликает по чемодану.

Правильно: чемодан получает baggage tag, уезжает по conveyor и исчезает
за baggage curtain; персонаж немного продвигается; следующее задание.

Неправильно: реакция чемодана, красный X/INCORRECT, −1 жизнь; те же
варианты и то же предложение остаются.

### Задания GAME 1

1.  My brother \_\_\_ at the airport. --- `work / works / workes` ---
    **works**
2.  The café \_\_\_ at 6 a.m. --- `open / opens / openes` --- **opens**
3.  She \_\_\_ to London every month. --- `fly / flies / flys` ---
    **flies**
4.  Passengers usually \_\_\_ online. ---
    `check in / checks in / check ins` --- **check in**
5.  The shuttle \_\_\_ every 20 minutes. --- `leave / leaves / leafs`
    --- **leaves**
6.  He \_\_\_ two small bags. --- `have / has / haves` --- **has**
7.  Anna \_\_\_ her passport in her handbag. ---
    `carry / carries / carrys` --- **carries**
8.  This bus \_\_\_ at Terminal 1. --- `stop / stops / stopes` ---
    **stops**
9.  Our flight \_\_\_ at 8:45. --- `depart / departs / departes` ---
    **departs**
10. The pilot \_\_\_ to the passengers before the flight. ---
    `talk / talks / talkes` --- **talks**
11. My parents \_\_\_ abroad twice a year. ---
    `travel / travels / traveles` --- **travel**
12. The plane \_\_\_ at 10:30. --- `arrive / arrives / arrieves` ---
    **arrives**
13. Jack usually \_\_\_ a window seat. --- `choose / chooses / choises`
    --- **chooses**
14. We always \_\_\_ our tickets online. --- `buy / buys / buies` ---
    **buy**
15. The information desk \_\_\_ at midnight. ---
    `close / closes / closees` --- **closes**
16. My wife \_\_\_ a small suitcase when she travels. ---
    `take / takes / taks` --- **takes**
17. They usually \_\_\_ at the airport two hours early. ---
    `arrive / arrives / arrieves` --- **arrive**
18. Sarah \_\_\_ her passport before every trip. ---
    `check / checks / checkes` --- **checks**
19. The airport bus \_\_\_ past our hotel. --- `go / goes / gos` ---
    **goes**
20. I always \_\_\_ my boarding pass on my phone. ---
    `keep / keeps / keepes` --- **keep**

После №20 Boarding Pass визуально выезжает из принтера и перемещается в
YOUR JOURNEY. Показать **CHECK-IN COMPLETE**.

## 10. GAME 2 --- SECURITY

Present Simple negative. 20 заданий.

Security/X-ray area. Conveyor визуально движется. Для разнообразия использовать существующие отдельные assets: три варианта suitcase, `security_tray.png` и `backpack.png`. Их можно чередовать между 20 заданиями.

Правильно: предмет движется по conveyor → заезжает внутрь X-ray scanner → исчезает внутри → краткий X-ray/scanning visual → **CLEARED ✓** → следующее задание.

Не требуется показывать выезд предмета с другой стороны scanner: на утверждённом фоне выходная сторона почти не видна, поэтому предпочтителен чистый вариант «заехал внутрь → исчез → CLEARED ✓».

Неправильно: **CHECK AGAIN / INCORRECT**, −1 жизнь, то же задание.

### Задания GAME 2

1.  He \_\_\_ liquids in his hand luggage. ---
    `doesn't carry / don't carry / doesn't carries` --- **doesn't
    carry**
2.  We \_\_\_ large bottles through security. ---
    `don't take / doesn't take / don't takes` --- **don't take**
3.  She \_\_\_ a laptop with her. ---
    `doesn't have / don't have / doesn't has` --- **doesn't have**
4.  This airline \_\_\_ cash at this desk. ---
    `doesn't accept / don't accept / doesn't accepts` --- **doesn't
    accept**
5.  They \_\_\_ much luggage when they travel. ---
    `don't carry / doesn't carry / don't carries` --- **don't carry**
6.  My husband \_\_\_ by plane very often. ---
    `doesn't travel / don't travel / doesn't travels` --- **doesn't
    travel**
7.  I \_\_\_ food in my hand luggage. ---
    `don't keep / doesn't keep / don't keeps` --- **don't keep**
8.  The shuttle \_\_\_ after midnight. ---
    `doesn't run / don't run / doesn't runs` --- **doesn't run**
9.  Passengers \_\_\_ their coats on during the security check. ---
    `don't keep / doesn't keep / don't keeps` --- **don't keep**
10. Our airline \_\_\_ meals on short flights. ---
    `doesn't serve / don't serve / doesn't serves` --- **doesn't serve**
11. You \_\_\_ your boarding pass at this desk. ---
    `don't need / doesn't need / don't needs` --- **don't need**
12. Tom \_\_\_ a suitcase when he travels for work. ---
    `doesn't take / don't take / doesn't takes` --- **doesn't take**
13. These buses \_\_\_ to the city centre. ---
    `don't go / doesn't go / don't goes` --- **don't go**
14. My sister \_\_\_ coffee before a flight. ---
    `doesn't drink / don't drink / doesn't drinks` --- **doesn't drink**
15. We \_\_\_ at expensive airport restaurants. ---
    `don't eat / doesn't eat / don't eats` --- **don't eat**
16. The airport \_\_\_ at night. ---
    `doesn't close / don't close / doesn't closes` --- **doesn't close**
17. I \_\_\_ a taxi to the airport. ---
    `don't usually take / doesn't usually take / don't usually takes`
    --- **don't usually take**
18. Emma \_\_\_ her passport in her suitcase. ---
    `doesn't put / don't put / doesn't puts` --- **doesn't put**
19. International passengers \_\_\_ at this gate. ---
    `don't check in / doesn't check in / don't checks in` --- **don't
    check in**
20. This machine \_\_\_ foreign coins. ---
    `doesn't accept / don't accept / doesn't accepts` --- **doesn't
    accept**

После №20 security gate становится зелёным, пассажир проходит рамку,
Security item/stamp появляется в YOUR JOURNEY. Показать **SECURITY
CLEARED**.

## 11. GAME 3 --- FIND YOUR GATE

Present Simple questions. **15 заданий.**

Нет multiple choice. Пользователь самостоятельно печатает вопрос.

Проверка: - ignore case; - trim leading/trailing whitespace; - normalize
repeated spaces; - финальный `?` optional.

Не принимать грамматически неправильные варианты.

При ошибке: - INCORRECT / TRY AGAIN; - −1 жизнь; - input полностью
очищается; - никаких подсказок; - никаких выделений; - правильный ответ
не показывается; - остаётся тот же вопрос.

### Движение GAME 3

Questions 1--4: **INFORMATION DESK** --- персонаж у стойки информации.

Questions 5--8: **MOVING WALKWAY** --- персонаж движется по travelator.

Questions 9--12: **AIRPORT SHUTTLE** --- персонаж едет на shuttle/train;
терминал движется за окнами; можно показывать B8 → B12 → B16 → B20.

Questions 13--15: **GATES** --- персонаж идёт по терминалу; B20 → B22 →
B24.

После №15 показать **GATE B24 FOUND** и сразу запустить FINAL CALL. Не
возвращаться на HOME.

### Задания GAME 3

1.  `(this bus / go / to Terminal 2)` → **Does this bus go to Terminal
    2?**
2.  `(you / accept / cards)` → **Do you accept cards?**
3.  `What time __________? (the flight / leave)` → **What time does the
    flight leave?**
4.  `Where __________? (the shuttle / stop)` → **Where does the shuttle
    stop?**
5.  `(the airport / have / free Wi-Fi)` → **Does the airport have free
    Wi-Fi?**
6.  `Where __________? (passengers / collect / their luggage)` → **Where
    do passengers collect their luggage?**
7.  `(this café / serve / breakfast)` → **Does this café serve
    breakfast?**
8.  `What time __________? (the shops / close)` → **What time do the
    shops close?**
9.  `(I / need / my passport here)` → **Do I need my passport here?**
10. `Where __________? (the airport bus / leave from)` → **Where does
    the airport bus leave from?**
11. `(this train / stop / at the airport)` → **Does this train stop at
    the airport?**
12. `How much __________? (a taxi / to the city centre / cost)` → **How
    much does a taxi to the city centre cost?**
13. `(they / check / passports here)` → **Do they check passports
    here?**
14. `How often __________? (the shuttle / run)` → **How often does the
    shuttle run?**
15. `Where __________? (I / show / my boarding pass)` → **Where do I
    show my boarding pass?**

## 12. FINAL CALL --- визуальная награда

FINAL CALL не является четвёртой грамматической игрой.

Никаких вопросов, вариантов, жизней или дополнительных кликов. Это
автоматическая визуальная награда после Question 15.

Departure board: **FINAL CALL** **FLIGHT AR725 TO LONDON** **GATE B24
--- CLOSING**

Cinematic sequence: 1. пассажир видит FINAL CALL; 2. хватает/подтягивает
чемодан; 3. быстро движется по терминалу; 4. использует moving walkway;
5. проходит B22 → B24; 6. Gate B24 начинает закрываться; 7. пассажир
успевает; 8. проходит в jet bridge; 9. самолёт у терминала; 10. plane
taxi; 11. runway; 12. разгон; 13. взлёт.

Сцена должна быть эффектной, но не чрезмерно длинной.

## 13. FINAL SCREEN

После взлёта:

**YOU MADE IT! ✈️** **Have a great flight!**

YOUR JOURNEY: - BOARDING PASS ✓ - SECURITY ✓ - GATE B24 ✓

Не показывать score, accuracy, mistakes или statistics.

Кнопки: - **HOME** --- на главный экран; - **PLAY AGAIN** --- GAME 3 с
Question 1.

## 14. Утверждённые изображения / реальные asset names

Все основные изображения уже созданы. Они находятся в:

```text
assets/images/
```

Использовать существующие файлы точно с этими именами:

```text
airport_home.png
airport_checkin.png
airport_security.png
airport_terminal.png
airport_shuttle.png
traveler_walking.png
traveler_running.png
suitcase.png
suitcase_red.png
suitcase_yellow.png
airplane.png
boarding_pass.png
security_tray.png
backpack.png
```

Не переименовывать, не заменять и не перерисовывать их без отдельного указания пользователя.

Назначение основных backgrounds:
- `airport_home.png` — HOME;
- `airport_checkin.png` — GAME 1 / CHECK-IN;
- `airport_security.png` — GAME 2 / SECURITY;
- `airport_terminal.png` — Information Desk, Moving Walkway и Gates в GAME 3, а также подходящие части FINAL CALL;
- `airport_shuttle.png` — Questions 9–12 / airport shuttle.

Персонаж:
- `traveler_walking.png` — обычное движение по аэропорту;
- `traveler_running.png` — FINAL CALL.

Остальные:
- `suitcase.png`, `suitcase_red.png`, `suitcase_yellow.png` — варианты багажа/ответов и SECURITY;
- `boarding_pass.png` — награда после CHECK-IN;
- `security_tray.png`, `backpack.png` — SECURITY;
- `airplane.png` — финальная сцена taxi/runway/takeoff.

UI, тексты, questions, answer labels, hearts, HOME, Music/SFX controls, YOUR JOURNEY, CLEARED/INCORRECT, completion messages, FINAL CALL board и кнопки делать HTML/CSS/JS, а не встраивать в backgrounds.

## 15. DEBUG / DEVELOPMENT MODE

Обязательно предусмотреть debug mode, чтобы не проходить десятки заданий
при тестировании.

Примеры:

``` text
?debug=checkin
?debug=security
?debug=questions
?debug=questions&step=15
?debug=final
```

Нужен прямой доступ к: - началу каждой игры; - последнему CHECK-IN; -
последнему SECURITY; - последнему QUESTIONS; - FINAL CALL; - FINAL
SCREEN.

Debug не должен мешать обычному пользователю.

## 16. STATE MANAGEMENT

Только текущий runtime/session state: current screen, current mini-game, current question, current lives, music volume, SFX volume и temporary animation state.

Не сохранять completed games между днями. Не использовать localStorage/cookies для игрового прогресса. YOUR JOURNEY определяется текущей сценой/мини-игрой, а не историей прохождения. Не делать аккаунты/backend.

## 17. Запреты

Без отдельного согласования НЕ добавлять: - score; - coins; - stars; -
best score; - leaderboard; - achievements; - timer на grammar tasks; -
hints; - показ правильного ответа после ошибки; - automatic answer
reveal; - persistent completed progress/localStorage; - обязательный
порядок GAME 1 → GAME 2 → GAME 3; - дополнительные grammar questions в
FINAL CALL; - drag-and-drop sentence ordering; - тяжёлые frameworks; -
обязательные внешние CDN-зависимости; - hard-coded production URLs.

Не менять утверждённые предложения самостоятельно.

## 18. Организация разработки

Не делать игру одним огромным монолитным файлом.

Организовать код так, чтобы легко: - менять изображения; - подключать
музыку/SFX; - редактировать вопросы; - менять варианты; - менять
анимации; - исправлять отдельный экран без поломки остальных.

Перед финальной сдачей проверить: - console errors; - broken asset
paths; - JS syntax; - responsive behaviour; - local/direct browser
opening; - hosted environment; - iframe behaviour; - Music/SFX
controls; - HOME navigation; - restart after 3 errors; - каждый correct
answer; - каждый incorrect option; - debug routes; - FINAL CALL
sequence.

## 19. Ключевое правило для Codex

Этот документ --- главная спецификация **AIRPORT RUSH**.

Не менять механику, грамматику, количество заданий, систему жизней,
навигацию, финал, визуальную концепцию или техническую архитектуру без
отдельного указания пользователя.

Если какой-либо технический пункт неоднозначен, сохранить утверждённую логику и выбрать наиболее лёгкое, надёжное решение, совместимое с GitHub Pages, обычным статическим хостингом и Genially iframe.

Использовать только относительные asset paths. Реальные имена файлов из разделов Images и Audio имеют приоритет над любыми более ранними черновыми именами/структурами.

Не начинать финальную оптимизацию/конвертацию исходных assets до завершения основной сборки и функционального тестирования. Оптимизация — отдельный финальный этап.
