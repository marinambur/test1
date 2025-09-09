# Пошаговая инструкция запуска проекта "История операций"

## Шаг 1: Установка зависимостей

### 1.1 Установка корневых зависимостей
```bash
npm install
```

### 1.2 Установка зависимостей backend
```bash
cd backend
npm install
cd ..
```

### 1.3 Установка зависимостей frontend
```bash
cd frontend
npm install
cd ..
```

## Шаг 2: Настройка базы данных

### 2.1 Запуск PostgreSQL через Docker
```bash
docker-compose up -d postgres
```

### 2.2 Создание файла окружения для backend
Создать файл `backend/.env` со следующим содержимым:
```env
NODE_ENV=development
PORT=3015

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=transaction_history
```

## Шаг 3: Запуск Backend

### 3.1 Компиляция и запуск NestJS сервера
```bash
cd backend
npm run start:dev
```

### 3.2 Проверка работы API
Откройте браузер и перейдите на:
- GraphQL Playground: http://localhost:3015/graphql

### 3.3 Заполнение БД тестовыми данными (опционально)
```bash
cd backend
npm run seed
```

## Шаг 4: Запуск Frontend

### 4.1 Запуск Nuxt 3 приложения
```bash
cd frontend
npm run dev
```

### 4.2 Открытие приложения
Откройте браузер и перейдите на:
- Frontend: http://localhost:3000

## Шаг 5: Тестирование функциональности

### 5.1 Проверка GraphQL запросов
В GraphQL Playground выполните:

```graphql
# Получение списка транзакций
query {
  transactions(page: 1, limit: 20) {
    transactions {
      id
      type
      amount
      currency
      description
      date
    }
    total
    hasNextPage
  }
}

# Создание новой транзакции
mutation {
  createTransaction(input: {
    type: INCOME
    amount: 1000.50
    currency: USD
    description: "Test transaction"
    date: "2024-01-15T10:30:00Z"
    idempotencyKey: "unique-key-123"
  }) {
    id
    type
    amount
    description
  }
}
```

### 5.2 Проверка фильтрации
1. Откройте frontend приложение
2. Используйте фильтры по дате, типу, сумме
3. Проверьте пагинацию
4. Создайте новую транзакцию через UI

## Шаг 6: Производственная сборка

### 6.1 Сборка и запуск через Docker
```bash
# Запуск всех сервисов
docker-compose up --build

# Остановка сервисов
docker-compose down
```

### 6.2 Ручная сборка
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run preview
```

## Возможные проблемы и решения

### Проблема: База данных не запускается
**Решение**: Убедитесь, что Docker запущен и порт 5432 свободен:
```bash
docker ps
lsof -i :5432
```

### Проблема: Backend не подключается к БД
**Решение**: Проверьте переменные окружения в `.env` файле и статус PostgreSQL

### Проблема: Frontend не может подключиться к API
**Решение**: Убедитесь, что backend запущен на порту 3015 и CORS настроен правильно

### Проблема: Медленная работа с большими данными
**Решение**: 
- Используйте пагинацию вместо загрузки всех данных
- Включите виртуализацию в таблице
- Добавьте индексы в БД

## Структура проекта

```
transaction-history/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── transaction/  # Модуль транзакций
│   │   ├── database/     # Конфигурация БД и seeds
│   │   └── config/       # Конфигурации приложения
│   └── package.json
├── frontend/             # Nuxt 3 SPA
│   ├── components/       # Vue компоненты
│   ├── pages/           # Страницы приложения
│   ├── stores/          # Pinia stores
│   ├── types/           # TypeScript типы
│   └── package.json
├── docker-compose.yml   # Docker конфигурация
└── package.json        # Root workspace
```

## Технические особенности

### Backend
- ✅ GraphQL API с идемпотентностью
- ✅ Пагинация и фильтрация
- ✅ Валидация данных
- ✅ TypeORM + PostgreSQL
- ✅ Индексы для производительности

### Frontend
- ✅ Виртуализация таблицы для 10K+ записей
- ✅ Реактивные фильтры с debounce
- ✅ Управление состоянием через Pinia
- ✅ Адаптивный дизайн
- ✅ Обработка состояний загрузки/ошибок

### Производительность
- ✅ Индексы БД для быстрых запросов
- ✅ Виртуализация интерфейса
- ✅ Пагинация вместо полной загрузки
- ✅ Debounced фильтры 
