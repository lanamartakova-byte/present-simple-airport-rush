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
  correct.mp3
  wrong.mp3
  click.mp3
  airport_ding.mp3
  reward.mp3
  seatbelt.mp3
  takeoff.mp3
```

Не переименовывать и не заменять эти файлы без отдельного указания пользователя.

Назначение:
- `background_music.mp3` — постоянная фоновая музыка;
- `correct.mp3` — правильный ответ;
- `wrong.mp3` — неправильный ответ;
- `click.mp3` — UI-клики;
- `airport_ding.mp3` — airport/departure announcement cue, в том числе перед FINAL CALL;
- `reward.mp3` — появление Boarding Pass / награда;
- `seatbelt.mp3` — финальная авиационная часть;
- `takeoff.mp3` — взлёт самолёта в FINAL CALL.

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

Security/X-ray area. Conveyor визуально движется. Для разнообразия использовать существующие отдельные assets: три варианта suitcase, `security_tray.webp` и `backpack.webp`. Их можно чередовать между 20 заданиями.

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

Главная учебная цель GAME 3 --- самостоятельное построение вопросов в Present Simple с **Do / Does**, включая WH-questions с `where`, `what time`, `how much`, `how often`.

GAME 3 должна ощущаться не как обычный worksheet с полем ввода, а как реальный поиск **Gate B24**. Правильно построенный вопрос запускает видимое действие в аэропорту и продвигает игрока по маршруту.

### 11.1. Общая механика

Основной формат --- **TYPE**: пользователь самостоятельно печатает полный вопрос.

Дополнительные форматы используются только для разнообразия и не должны превращать GAME 3 в multiple choice:

- **TYPE** --- самостоятельно напечатать полный вопрос;
- **BUILD** --- собрать вопрос из перемешанных карточек/частей;
- **SPOT & FIX** --- увидеть грамматически неправильный вопрос и самостоятельно переписать его правильно в input.

Баланс на 15 заданий:
- **10 TYPE**;
- **3 BUILD**;
- **2 SPOT & FIX**;
- **0 обычных multiple choice**.

Для TYPE и SPOT & FIX проверка:
- ignore case;
- trim leading/trailing whitespace;
- normalize repeated spaces;
- финальный `?` optional;
- не принимать грамматически неправильные варианты.

При ошибке:
1. показать **INCORRECT / TRY AGAIN**;
2. проиграть `wrong.mp3`;
3. −1 жизнь;
4. для TYPE / SPOT & FIX полностью очистить input;
5. для BUILD вернуть неверно размещённую карточку/сборку в исходное состояние;
6. никаких подсказок;
7. никаких выделений правильной части;
8. правильный ответ не показывать;
9. остаётся то же задание.

Переход к следующему заданию только после правильного ответа.

После третьей ошибки GAME 3 автоматически перезапускается с Question 1 и снова с 3 жизнями.

### 11.2. Главное правило интерактива и движения

Во время выполнения задания сцена не должна выглядеть полностью замершей. Допустимы лёгкие фоновые движения: airport displays, индикаторы, travelator, движение терминала за окнами shuttle, световые элементы и т. п.

После каждого правильного ответа обязательно происходит короткое сюжетное действие примерно 1--2 секунды. Игрок должен успеть увидеть результат своего вопроса до появления следующего задания.

Не использовать искусственное «скольжение» статичного PNG-персонажа по экрану как имитацию ходьбы. Если натуральную ходьбу нельзя сделать убедительно, движение создаётся за счёт окружения, указателей, транспорта, табло и переходов между зонами.

Правильный вопрос должен ощущаться как действие:
**спросил → аэропорт ответил/отреагировал → открылось направление или новая информация → игрок приблизился к Gate B24.**

### 11.3. UI GAME 3

Верхняя левая HUD-плашка: утверждённый asset **FIND YOUR GATE / Questions** с динамическими сердцами в предназначенной для них области. Не накладывать поверх asset дублирующие `FIND YOUR GATE` или `Questions`.

YOUR JOURNEY:
- BOARDING PASS ✓
- SECURITY ✓
- GATE B24 = current

Инструкция зависит от формата:
- TYPE / BUILD: **MAKE A QUESTION**
- SPOT & FIX: **FIX THE QUESTION**

Инструкция находится на небольшой аккуратной игровой плашке.

Основная task panel показывает номер `1/15 ... 15/15`, ситуацию/миссию и грамматическую подсказку.

Для TYPE и SPOT & FIX используется input + CHECK.
Для BUILD используются кликабельные/перетаскиваемые карточки; обычных вариантов A/B/C нет.

**Верхняя safe zone GAME 3:** не размещать там сюжетные таблички, shuttle, route markers или другие временные игровые объекты. Верх экрана зарезервирован под постоянные HUD-плашки, жизни, YOUR JOURNEY, HOME/audio controls и instruction/task UI. Сюжетные знаки (`terminal2_sign.webp` и HTML/CSS direction signs) появляются ниже этой зоны и не должны создавать визуальное нагромождение.

### 11.4. Маршрут GAME 3

Questions 1--4: **INFORMATION DESK** --- игрок собирает первоначальную информацию и получает направление к следующей зоне.

Questions 5--8: **MOVING WALKWAY** --- путь по терминалу; travelator и элементы окружения создают постоянное мягкое движение.

Questions 9--12: **AIRPORT SHUTTLE** --- отдельная наружная сцена у Shuttle Stop на `airport_shuttle.webp`. Отдельный `airport_shuttle_bus.webp` въезжает по дороге слева/из центральной части кадра вправо, останавливается у Shuttle Stop и используется как главный движущийся объект этапа. Маршрут визуально проходит B8 → B12 → B16 → B20 через route display/указатели и лёгкое движение окружения.

Questions 13--15: **GATES** --- финальный поиск: B20 → B22 → B24.

После Question 15 показать **GATE B24 FOUND ✓**, обновить YOUR JOURNEY до `GATE B24 ✓`, затем автоматически запустить FINAL CALL. На HOME перед FINAL CALL не возвращаться.

### 11.5. Задания и интерактив GAME 3

#### 1/15 --- INFORMATION DESK --- TYPE

Ситуация:
**You need to get to Terminal 2. Ask for help.**

Prompt:
`(this bus / go / to Terminal 2)`

Correct:
**Does this bus go to Terminal 2?**

Во время ввода: небольшой airport/terminal display может мягко переключать `T1 / T2 / T3`.

После correct:
- `correct.mp3`;
- сотрудник/информационная зона визуально реагирует без сложной анимации персонажа;
- появляется/загорается отдельный asset `terminal2_sign.webp` (**TERMINAL 2 →**) в свободной игровой зоне ниже постоянного верхнего UI;
- НЕ показывать и НЕ анимировать автобус внутри `airport_terminal.webp`: это внутренняя сцена терминала;
- затем Question 2.

#### 2/15 --- INFORMATION DESK --- BUILD

Ситуация:
**You want to pay by card. Ask.**

Карточки в перемешанном порядке:
`cards` / `Do` / `accept` / `you`

Correct:
**Do you accept cards?**

После correct:
- карточки фиксируются в правильном порядке;
- короткая положительная подсветка;
- на небольшом payment/card terminal загорается зелёный ✓ / **ACCEPTED**;
- затем Question 3.

#### 3/15 --- INFORMATION DESK --- TYPE

Ситуация:
**You need to know when your flight leaves. Ask.**

Prompt:
`What time __________? (the flight / leave)`

Correct:
**What time does the flight leave?**

Во время ввода: departure display слегка «живёт»/переключается.

После correct:
- airport-board flip/refresh animation;
- появляется и подсвечивается:
  **AR725 · LONDON · 18:45**;
- затем Question 4.

#### 4/15 --- INFORMATION DESK --- TYPE

Ситуация:
**You need to find the shuttle. Ask.**

Prompt:
`Where __________? (the shuttle / stop)`

Correct:
**Where does the shuttle stop?**

После correct:
- загорается текстовый/HTML-CSS указатель **SHUTTLE →**;
- не запускать автобус внутри терминала;
- короткий переход из INFORMATION DESK в MOVING WALKWAY на том же `airport_terminal.webp`;
- затем Question 5.

#### 5/15 --- MOVING WALKWAY --- TYPE

Ситуация:
**You need Wi-Fi on the way. Ask.**

Prompt:
`(the airport / have / free Wi-Fi)`

Correct:
**Does the airport have free Wi-Fi?**

Во время ввода: travelator медленно движется; движение должно быть мягким и ненавязчивым.

После correct:
- загорается **FREE WI-FI ✓**;
- короткая анимация Wi-Fi waves;
- затем Question 6.

#### 6/15 --- MOVING WALKWAY --- BUILD

Ситуация:
**You need to know where passengers collect their luggage. Ask.**

Карточки:
`Where` / `do` / `passengers` / `collect` / `their luggage`

Correct:
**Where do passengers collect their luggage?**

После correct:
- airport direction display перелистывается;
- появляется **BAGGAGE CLAIM ←**;
- стрелка мягко загорается;
- затем Question 7.

#### 7/15 --- MOVING WALKWAY --- TYPE

Ситуация:
**You want breakfast. Ask about the café.**

Prompt:
`(this café / serve / breakfast)`

Correct:
**Does this café serve breakfast?**

После correct:
- небольшая вывеска/индикатор café переключается на **BREAKFAST ✓**;
- короткая световая реакция;
- затем Question 8.

#### 8/15 --- MOVING WALKWAY --- SPOT & FIX

На дисплее показан неправильный вопрос:
**What time does the shops close?**

Instruction:
**FIX THE QUESTION**

Пользователь самостоятельно переписывает полный вопрос.

Correct:
**What time do the shops close?**

После correct:
- дисплей делает flip;
- появляется **SHOPS CLOSE 22:00**;
- travelator на короткий момент визуально ускоряется;
- переход в AIRPORT SHUTTLE;
- затем Question 9.

#### 9/15 --- AIRPORT SHUTTLE --- TYPE

Ситуация:
**You are entering the shuttle area. Ask about your passport.**

Prompt:
`(I / need / my passport here)`

Correct:
**Do I need my passport here?**

Во время ввода: наружная сцена `airport_shuttle.webp` остаётся живой за счёт лёгких UI/route-индикаторов; отдельный `airport_shuttle_bus.webp` может быть виден подъезжающим или стоящим у остановки, но не должен перекрывать task panel.

После correct:
- `airport_shuttle_bus.webp` плавно подъезжает/доводит движение вправо и останавливается у Shuttle Stop;
- короткая реакция route display;
- route indicator показывает **NEXT → B8**;
- затем Question 10.

#### 10/15 --- AIRPORT SHUTTLE --- TYPE

Prompt:
`Where __________? (the airport bus / leave from)`

Correct:
**Where does the airport bus leave from?**

После correct:
- route display переключается **B8 → B12**;
- создать ощущение продвижения лёгким CSS/JS-сдвигом route markers/окружения; не рисовать второй автобус;
- `airport_shuttle_bus.webp` остаётся единым отдельным движущимся shuttle asset;
- затем Question 11.

#### 11/15 --- AIRPORT SHUTTLE --- BUILD

Карточки:
`Does` / `this train` / `stop` / `at the airport`

Correct:
**Does this train stop at the airport?**

После correct:
- route display переключается **B12 → B16**;
- короткий CSS/JS route-motion effect показывает продвижение к B16;
- не добавлять новые растровые автобусы/транспорт;
- затем Question 12.

#### 12/15 --- AIRPORT SHUTTLE --- TYPE

Prompt:
`How much __________? (a taxi / to the city centre / cost)`

Correct:
**How much does a taxi to the city centre cost?**

После correct:
- route display переключается **B16 → B20**;
- появляется/проходит **B20**;
- `airport_shuttle_bus.webp` визуально продолжает движение вправо и уезжает из сцены;
- появляется **EXIT → GATES B20–B30**;
- переход обратно на `airport_terminal.webp` в GATES;
- затем Question 13.

#### 13/15 --- GATES --- TYPE

Ситуация:
**You arrive at Gate B20. Ask about passport checks.**

Prompt:
`(they / check / passports here)`

Correct:
**Do they check passports here?**

Во время ввода: табло B20 и airport displays имеют лёгкую idle-анимацию.

После correct:
- **B20 ✓**;
- загорается **B22 →**;
- окружение/фон плавно смещается так, чтобы ощущалось продвижение по терминалу, без скольжения статичного персонажа;
- затем Question 14.

#### 14/15 --- GATES --- SPOT & FIX

На дисплее неправильный вопрос:
**How often do the shuttle run?**

Instruction:
**FIX THE QUESTION**

Пользователь самостоятельно переписывает полный вопрос.

Correct:
**How often does the shuttle run?**

После correct:
- **B22 ✓**;
- впереди начинает мигать/подсвечиваться **B24 →**;
- ещё один короткий переход вперёд по терминалу;
- затем Question 15.

#### 15/15 --- GATES --- TYPE

Ситуация:
**You are almost there. Ask where to show your boarding pass.**

Prompt:
`Where __________? (I / show / my boarding pass)`

Correct:
**Where do I show my boarding pass?**

После correct:
1. `correct.mp3`;
2. **B24 →** начинает мигать;
3. Gate B24 / его табло визуально становится главным объектом сцены;
4. status board делает airport flip:
   `ON TIME` → `BOARDING` → `FINAL CALL`;
5. проигрывается `airport_ding.mp3`;
6. YOUR JOURNEY обновляется:
   BOARDING PASS ✓ → SECURITY ✓ → GATE B24 ✓;
7. показать **GATE B24 FOUND ✓**;
8. после короткой паузы автоматически запустить FINAL CALL.

### 11.6. Технические требования к интерактиву GAME 3

- Не добавлять тяжёлые animation frameworks.
- Движение делать CSS/JS (`transform`, `translate`, `opacity`, лёгкие flip/slide effects).
- Не создавать отдельный тяжёлый asset для каждого вопроса, если эффект можно сделать HTML/CSS.
- Использовать утверждённые backgrounds:
  - `airport_terminal.webp` --- НОВАЯ очищенная внутренняя сцена терминала для INFORMATION DESK, MOVING WALKWAY и GATES; верхняя зона изображения специально очищена от крупных рекламных/flight-board/overhead sign элементов, чтобы не конфликтовать с постоянным HUD;
  - `airport_shuttle.webp` --- НОВАЯ наружная сцена Terminal 2 / Shuttle Stop с дорогой справа; используется только для Questions 9--12.
- Использовать новые отдельные assets:
  - `airport_shuttle_bus.webp` --- отдельный shuttle bus на прозрачном фоне, ориентирован вправо; анимировать CSS/JS поверх `airport_shuttle.webp`;
  - `terminal2_sign.webp` --- отдельный знак **TERMINAL 2 →** на прозрачном фоне без верхних подвесов; показывать по сюжету, а не держать постоянно.
- `airport_shuttle.webp` и `airport_shuttle_bus.webp` --- разные файлы: первый является background, второй --- отдельным движущимся объектом.
- Не заставлять `airport_shuttle_bus.webp` ехать внутри `airport_terminal.webp`.
- Не размещать сюжетные direction signs постоянно в верхней части экрана. Верх зарезервирован под постоянные HUD-плашки, YOUR JOURNEY, HOME/audio и instruction/task UI.
- Остальные динамические указатели (`SHUTTLE →`, `BAGGAGE CLAIM ←`, `B22 →`, `B24 →`, route display, Wi-Fi, ACCEPTED и т. п.) по умолчанию делать HTML/CSS, если отдельный asset не будет согласован позже.
- Не менять утверждённые 15 correct questions.
- Ситуационные строки служат контекстом и не заменяют исходные grammar prompts.
- Анимация correct не должна блокировать HOME/audio controls.
- Во время correct animation не принимать повторные клики/submit.
- После завершения animation переходить к следующему заданию автоматически.
- Не сохранять прогресс GAME 3 в localStorage/cookies.

### 11.7. DEBUG GAME 3

Поддерживать:
- `?debug=questions` --- Question 1;
- `?debug=questions&step=5` --- начало MOVING WALKWAY;
- `?debug=questions&step=9` --- начало AIRPORT SHUTTLE;
- `?debug=questions&step=13` --- начало GATES;
- `?debug=questions&step=15` --- последнее grammar-задание;
- `?debug=final` --- FINAL CALL.

Debug должен позволять тестировать каждую зону без ручного прохождения предыдущих вопросов и не должен менять обычное поведение игры.

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
airport_home.webp
airport_checkin.webp
airport_security.webp
airport_terminal.webp
airport_shuttle.webp
airport_shuttle_bus.webp
terminal2_sign.webp
traveler_walking.webp
traveler_running.webp
suitcase.webp
suitcase_red.webp
suitcase_yellow.webp
airplane.webp
boarding_pass.webp
security_tray.webp
backpack.webp
```

Не переименовывать, не заменять и не перерисовывать их без отдельного указания пользователя.

Назначение основных backgrounds:
- `airport_home.webp` — HOME;
- `airport_checkin.webp` — GAME 1 / CHECK-IN;
- `airport_security.webp` — GAME 2 / SECURITY;
- `airport_terminal.webp` — обновлённый очищенный внутренний фон GAME 3 для Information Desk, Moving Walkway и Gates; верх специально оставлен визуально спокойным под HUD и task UI; также может использоваться в подходящих частях FINAL CALL;
- `airport_shuttle.webp` — обновлённый наружный фон Terminal 2 / Shuttle Stop для Questions 9–12; на самом background нет автобуса, чтобы отдельный shuttle можно было анимировать.

Новые GAME 3 assets:
- `airport_shuttle_bus.webp` — отдельный shuttle bus на прозрачном фоне, направлен вправо; используется только как анимируемый объект поверх `airport_shuttle.webp`;
- `terminal2_sign.webp` — отдельная прозрачная табличка `TERMINAL 2 →` без подвесов; появляется по сюжету в игровой зоне ниже верхнего интерфейса.

Персонаж:
- `traveler_walking.webp` — обычное движение по аэропорту;
- `traveler_running.webp` — FINAL CALL.

Остальные:
- `suitcase.webp`, `suitcase_red.webp`, `suitcase_yellow.webp` — варианты багажа/ответов и SECURITY;
- `boarding_pass.webp` — награда после CHECK-IN;
- `security_tray.webp`, `backpack.webp` — SECURITY;
- `airplane.webp` — финальная сцена taxi/runway/takeoff.

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
