# Примирення · церковний облік — вихідний код

Сайт: https://color1raw-dev.github.io/prymyrennia/
Готовий файл сайту: `prymyrennia-site/index.html` (його віддає GitHub Pages через `index.html` у корені).

## Як зібрати

Потрібен лише Python 3. З папки `source`:

    python3 build/build.py x        # збирає застосунок у build/page.html
    python3 site/build_site.py      # додає вхід через Supabase і пише ../index.html

Після цього закомітити `prymyrennia-site/index.html` — сайт оновиться сам за хвилину.

## Що де лежить

- `src/body.html` — початковий застосунок (модель даних, базові екрани).
- `build/head.html` — усі стилі та каркас сторінки.
- `build/override.js` — перероблені екрани, ролі, навчання, помічник.
- `build/ailocal.js` — помічник за командами (без ШІ).
- `build/vhome.js`, `build/rephead.js` — іконки та шапка звітів.
- `build/build.py` — склеює все в одну сторінку.
- `site/shim.js` — вхід, реєстрація і збереження даних у Supabase.
- `site/schema.sql` — таблиці та правила доступу бази (вже виконано в Supabase).
- `site/lib/supabase.js` — бібліотека Supabase, вбудовується у файл сайту.
- `logo/hands2.webp` — зображення рук.

## Ролі

owner (власник), full (повні права), deacon (бачить усіх, змінює своїх), pending (очікує), blocked.
Перший зареєстрований стає власником; власник може призначити власником іншого в розділі «Журнал змін» → «Користувачі».
