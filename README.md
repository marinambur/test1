# История операций

Fullstack приложение для управления историей операций с поддержкой больших объемов данных (10K+ записей).

## Технологии

- **Backend**: NestJS, GraphQL, TypeScript, PostgreSQL
- **Frontend**: Nuxt 3, Vue 3 Composition API, Pinia, TailwindCSS

## Структура проекта

```
/
├── backend/          # NestJS API сервер
├── frontend/         # Nuxt 3 приложение  
├── docker-compose.yml # PostgreSQL + развертывание
├── package.json      # Root workspace
└── README.md
```

## Запуск проекта

1. Установка зависимостей: `npm install`
2. Запуск БД: `docker-compose up -d postgres`
3. Запуск backend: `npm run dev:backend`
4. Запуск frontend: `npm run dev:frontend`

## Функциональность

### Backend
- GraphQL API для операций
- Идемпотентность запросов
- Пагинация и фильтрация
- Валидация данных

### Frontend  
- Таблица операций с виртуализацией
- Фильтры по дате, типу, сумме
- Управление состоянием через Pinia
- Адаптивный интерфейс 
