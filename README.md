# vue-lottery-app

Vue 3 + TypeScript + Vue Router + Pinia.

## Запуск

```bash
npm ci
cp .env.example .env
npm run dev
```

PowerShell: `Copy-Item .env.example .env`.

## Перевірка

```bash
npm run lint
npm run type-check
npm run build
```

## Налаштування

`VITE_API_URL` - адреса API. `VITE_BASE_PATH` - базовий шлях застосунку.
Локальний `.env` не зберігається в Git.

## Сторінки

Home - лотерея. Users - список користувачів, пошук, профілі та реєстрація.
Login - вхід до Users. About author - автор проєкту.

Обліковий запис: `emilys` / `emilyspass`.

## Деплой

Push у `feature/routing` запускає збірку та публікацію в `gh-pages`.
