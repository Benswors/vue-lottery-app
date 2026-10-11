# vue-lottery-app

Лабораторна робота №4: застосунок-лотерея на Vue 3 + TypeScript (Composition API) + Tailwind CSS + SCSS.

## Запуск
```bash
npm install
npm run dev        # режим розробки
npm run lint       # ESLint
npm run type-check # перевірка типів
npm run build      # продакшн-збірка
```

## Структура
- `src/components` — BaseButton, BaseInput, WinnerItem, WinnersList, RegisterFormBlock, ParticipantForm, ParticipantsTable, SearchBar, BaseModal
- `src/composables/useParticipants.ts` — стан, localStorage (watch deep), вибір переможців
- `src/utils/validation.ts` — regexp та правила валідації
