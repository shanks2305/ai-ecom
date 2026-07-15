# Database

## Database Choice

- **PostgreSQL** — primary relational database (PostgreSQL 16 via Docker in development)
- **Prisma ORM** — schema definition, migrations, and type-safe client

Schema lives at `backend/prisma/schema.prisma`. The Prisma client is generated to `backend/src/generated/prisma`.

## Naming Convention

- **PascalCase** for Prisma models (e.g. `User`, `Session`)
- **camelCase** for field names (e.g. `firstName`, `createdAt`)
- **snake_case** table names in PostgreSQL via `@@map` (e.g. `User` → `users`, `Session` → `sessions`)

## ID Strategy

- **UUID** string primary keys on all models (`@default(uuid())`)

## Timestamp Strategy

All models include:

- `createdAt` — set automatically on insert (`@default(now())`)
- `updatedAt` — updated automatically on change (`@updatedAt`)

## Relationships

```
User
 └── Session (one-to-many)
```

| Model   | Table     | Description                                      |
|---------|-----------|--------------------------------------------------|
| `User`  | `users`   | Account identity, role, and verification status  |
| `Session` | `sessions` | Auth sessions linked to a user; cascade-deleted when the user is removed |

### User

| Field        | Type     | Notes                          |
|--------------|----------|--------------------------------|
| `id`         | UUID     | Primary key                    |
| `email`      | String   | Unique                         |
| `firstName`  | String?  | Optional                       |
| `lastName`   | String?  | Optional                       |
| `role`       | `Role`   | Default: `CUSTOMER`            |
| `isVerified` | Boolean  | Default: `false`               |
| `isActive`   | Boolean  | Default: `true`                |
| `createdAt`  | DateTime |                                |
| `updatedAt`  | DateTime |                                |

**Role enum:** `CUSTOMER`, `ADMIN`, `SUPER_ADMIN`

### Session

| Field       | Type     | Notes                              |
|-------------|----------|------------------------------------|
| `id`        | UUID     | Primary key                        |
| `token`     | String   | Unique session token               |
| `expiresAt` | DateTime | Expiration time                    |
| `userId`    | UUID     | Foreign key → `User.id`            |
| `createdAt` | DateTime |                                    |
| `updatedAt` | DateTime |                                    |

Indexes: `userId`, `expiresAt`

## Migrations

Run all commands from the `backend/` directory.

### Local database

Start PostgreSQL:

```bash
npm run db:up
```

Set `DATABASE_URL` in `backend/.env` (see `backend/docker-compose.yml` for defaults).

### Commands

```bash
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

Equivalent npm scripts:

```bash
npm run db:migrate
npm run db:generate
npm run db:studio
```

Additional scripts:

| Script                  | Command                    | Purpose                          |
|-------------------------|----------------------------|----------------------------------|
| `npm run db:push`       | `prisma db push`           | Push schema without a migration  |
| `npm run db:reset`      | `prisma migrate reset`     | Reset database and re-run migrations |
| `npm run db:migrate:deploy` | `prisma migrate deploy` | Apply migrations in production   |

## Future Tables

Planned domain models not yet in the schema:

- Products
- Cart
- Orders
- Inventory
- Payments
- Addresses
