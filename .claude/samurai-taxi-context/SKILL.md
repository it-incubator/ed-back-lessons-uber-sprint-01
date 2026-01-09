---
name: samurai-taxi-context
description: Контекст проекта Samurai Taxi для быстрого погружения. Спринты, микросервисы, архитектурные паттерны, взаимодействие сервисов.
---

# Skill: Контекст проекта Samurai Taxi

Используй этот skill для быстрого погружения в контекст проекта.

## Обзор

**Samurai Taxi** — учебный микросервисный проект для курса backend-разработки.

## Спринты и уроки

| Sprint | Уроки | Тема | Стек |
|--------|-------|------|------|
| 1 | 01-04 | Drivers/Rides basics | Express + TS + MongoDB native |
| 2 | 05-08 | DDD/CQRS | Express + Inversify + Mongoose |
| 3 | 09-12 | Auth Service | NestJS + Mongoose + JWT |
| 4 | 13-16 | Files Service | NestJS + PostgreSQL + Raw SQL |
| 5 | 17-20 | Payments | NestJS + TypeORM + Stripe |
| 6 | 21-24 | Advanced | Concurrency, locks, indexes |

## Репозитории микросервисов

| Сервис | Репозиторий | Стек | Роль |
|--------|-------------|------|------|
| **Drivers MS** | `ed-back-lessons-uber-sprint-02` | Express + Inversify + Mongoose | Водители, поездки |
| **Auth MS** | `ed-back-lessons-uber-auth-sprint-03` | NestJS + Mongoose + DDD | Пользователи, JWT |
| **Files MS** | `ed-back-lessons-files-sprint-4` | NestJS + PostgreSQL + Raw SQL | Метаданные файлов, S3 |
| **Payments MS** | (Sprint 5) | NestJS + TypeORM + Stripe | Оплата, кошельки |

## Архитектурная документация

Канонические файлы находятся в текущем репозитории:

| Файл | Описание |
|------|----------|
| `full-program.md` | План всего курса |
| `full-architecture-mongo-ddd.md` | Архитектура MongoDB + Mongoose + DDD (Auth, Drivers) |
| `full-architecture-raw-sql.md` | Архитектура PostgreSQL + Raw SQL (Files) |
| `full-architecture-sql-typeorm-ddd.md` | Архитектура PostgreSQL + TypeORM + DDD (Payments) |
| `sprints-readmes/XX/` | Документация уроков |

> **Инструкция для Claude**: Если тебе нужен доступ к этим файлам, но они недоступны — спроси у пользователя абсолютный путь или попроси его добавить через `--add-dir`.

## Архитектурные паттерны

### Общие для всех сервисов
- **CQRS**: Commands возвращают id, Queries возвращают Output DTO
- **JSON:API**: `{ data: { type, id, attributes } }`
- **ApplicationResult**: `ok(data)` / `fail(message, code)`
- **Config validation**: Без дефолтов, fail-fast

### DDD с Mongoose (Auth, Drivers)
- Domain entities с методами
- Агрегаты, инварианты
- `loadClass()` для Mongoose
- `lean(false)` для гидратации

### Transaction Script (Files)
- Domain = интерфейсы (не классы)
- Бизнес-логика в handlers
- Raw SQL запросы
- Проще для CRUD

### Rich Domain Model с TypeORM (Payments)
- Domain = Entity class с методами (TypeORM декораторы)
- Бизнес-логика и инварианты в entity
- `static createInstance()` — фабричный метод
- Projection как тип (не класс)
- Transactional Outbox + Kafka

## Взаимодействие сервисов

```
User → Auth (регистрация, JWT)
     → Auth → Files (загрузка аватара)
     → Auth → Drivers (привязка водителя)
     → Drivers → Payments (оплата поездки)
```

Внешние API: Bearer JWT
Внутренние API: x-friend-token