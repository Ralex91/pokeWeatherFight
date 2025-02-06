# Backend

## Installation

### Install dependencies

```bash
pnpm install
```

### Config environment variables

```bash
cp .env.example .env
```

### Launch docker-compose

```
docker-compose up -d
```

### Database migrations

```
pnpm kysely migrate:latest
```

### Run development server

```
pnpm dev
```

## Migrations

### Create a new migration

```bash
pnpm kysely migrate:create <name>
```

### Run migrations

```bash
pnpm kysely migrate:up
```

### Rollback migrations

```bash
pnpm kysely migrate:down
```
