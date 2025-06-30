# Case Study: Microservice Architecture Prototype

This project is a prototype demonstrating a scalable strategy for sharing TypeORM models between multiple services in a Node.js/TypeScript environment. It uses a **pnpm monorepo** and a **data ownership** model to create a realistic, maintainable microservice architecture.

## Core Concepts

- **Monorepo:** All services and shared libraries live in a single repository. `pnpm workspaces` manages dependencies efficiently.
- **Shared Core Package:** The `@arbio/shared-core` package is the single source of truth for database entities and DTOs.
- **Data Ownership:** The `users-service` is the "owner" of the `User` data. It is the only service that contains and runs migrations for the `users` table.
- **Service Decoupling:** The `reporting-service` consumes the `User` model for type-safe reads but does not manage its schema, demonstrating loose coupling.

## Project Structure

```
/
|-- /apps
|   |-- /users-service      # Manages user data (port 3000)
|   |   |-- /src
|   |   |   |-- /migrations  # Database migrations
|   |   |   |-- /seeds       # Database seeding scripts
|   |   |   |-- data-source.ts
|   |   |   |-- server.ts
|   |-- /reporting-service  # Reads user data for reports (port 3001)
|   |   |-- /src
|   |   |   |-- data-source.ts
|   |   |   |-- server.ts
|-- /packages
|   |-- /shared-core        # @arbio/shared-core package
|   |   |-- /src
|   |   |   |-- /entities    # TypeORM entities
|   |   |   |-- /dtos        # Data Transfer Objects
|   |   |   |-- /mappers     # Entity to DTO mappers
|   |   |   |-- index.ts     # Package exports
|-- .github/workflows        # CI/CD for shared-core
|-- docker-compose.yml       # MySQL database setup
|-- package.json
|-- pnpm-workspace.yaml
```

## Architecture Overview

### Shared Code Structure
- **Entities:** TypeORM database models in `packages/shared-core/src/entities/`
- **DTOs:** API transport types in `packages/shared-core/src/dtos/`
- **Mappers:** Functions to convert entities to DTOs in `packages/shared-core/src/mappers/`
- **Validation:** Using `class-validator` decorators on DTOs

### Entity Synchronization
- All services import entities from `@arbio/shared-core/dist/entities/`
- Changes to shared entities automatically propagate to all services
- Built package ensures consistency across the monorepo

### Migration Management
- Each service owns and manages its own migrations
- `users-service` manages User entity migrations
- `reporting-service` is read-only (no migrations)
- Clear ownership prevents conflicts

### Service Decoupling
- Services depend only on `@arbio/shared-core`, not on each other
- No direct service-to-service dependencies
- Independent deployment and evolution

## How to Run

### Prerequisites

- Node.js (v18+)
- pnpm (`npm install -g pnpm`)
- Docker

### 1. Start the Database

From the project root, start the MySQL database using Docker.

```bash
docker-compose up -d
```

### 2. Install Dependencies

Install all dependencies for the entire workspace from the project root.

```bash
pnpm install
```

### 3. Build Shared Core

Build the shared-core package to ensure all services have access to the latest entities and DTOs.

```bash
pnpm --filter @arbio/shared-core build
```

### 4. Run Database Migrations & Seeding

Run the setup scripts **from the context of the `users-service`**. This only needs to be done once.

```bash
# Run migrations
pnpm --filter users-service migration:run

# Run all seeds
pnpm --filter users-service seed

# Run specific seeds
pnpm --filter users-service seed -- update-roles
pnpm --filter users-service seed -- initial-users
```

### 5. Start the Services

Open two separate terminals. Use `pnpm --filter` to run scripts in a specific app from the root.

**In Terminal 1 (for `users-service`):**

```bash
pnpm --filter users-service start
```

**In Terminal 2 (for `reporting-service`):**

```bash
pnpm --filter reporting-service start
```

### 6. Test the APIs

- **Users Service (Port 3000):**
  - `GET http://localhost:3000/users` - Get all users
  - `GET http://localhost:3000/users/:id` - Get user by ID
  - `POST http://localhost:3000/users` - Create new user
    ```json
    {
      "name": "Charlie",
      "email": "charlie@example.com"
    }
    ```

- **Reporting Service (Port 3001):**
  - `GET http://localhost:3001/user-report` - Get user analytics

## Development Workflow

### Adding New Models

1. **Create Entity in Shared Core:**
   ```bash
   # Add new entity to packages/shared-core/src/entities/
   # Example: Property.entity.ts
   ```

2. **Create DTOs:**
   ```bash
   # Add DTOs to packages/shared-core/src/dtos/
   # Example: create-property.dto.ts, property.dto.ts
   ```

3. **Create Mappers:**
   ```bash
   # Add mappers to packages/shared-core/src/mappers/
   # Example: property.mapper.ts
   ```

4. **Export from Shared Core:**
   ```typescript
   // Update packages/shared-core/src/index.ts
   export * from './entities/Property.entity';
   export * from './dtos/property.dto';
   export * from './mappers/property.mapper';
   ```

5. **Build Shared Core:**
   ```bash
   pnpm --filter @arbio/shared-core build
   ```

6. **Create Service (if needed):**
   ```bash
   # Create new service in apps/
   # Example: apps/properties-service/
   ```

7. **Add Migrations:**
   ```bash
   # Generate migration for the owning service
   pnpm --filter properties-service migration:generate src/migrations/CreateProperty
   ```

### Database Schema Evolution

1. **Modify Entity in Shared Core**
2. **Build Shared Core:** `pnpm --filter @arbio/shared-core build`
3. **Generate Migration:** `pnpm --filter users-service migration:generate src/migrations/AddNewField`
4. **Run Migration:** `pnpm --filter users-service migration:run`
5. **Update Seeds (if needed):** `pnpm --filter users-service seed -- update-data`

### Version Compatibility

- **Development:** All services use the latest version of shared-core via workspace dependencies
- **Production:** Can publish shared-core as versioned npm package for controlled upgrades
- **Breaking Changes:** Use semantic versioning and gradual migration strategies

## Testing

### Running Tests
```bash
# Test shared-core
pnpm --filter @arbio/shared-core test

# Test individual services
pnpm --filter users-service test
pnpm --filter reporting-service test
```

### CI/CD
- GitHub Actions workflow for shared-core: `.github/workflows/shared-core.yml`
- Automatically runs on changes to `packages/shared-core/`
- Lints, tests, and builds shared code

## Building for Production

### Build All Packages
```bash
# Build shared-core
pnpm --filter @arbio/shared-core build

# Build services
pnpm --filter users-service build
pnpm --filter reporting-service build
```

### Deployment
Each service can be deployed independently:
- Build the service: `pnpm --filter service-name build`
- Deploy the `dist/` folder
- Run migrations: `pnpm --filter service-name migration:run`

## Troubleshooting

### Common Issues

1. **Entity Not Found Error:**
   - Ensure shared-core is built: `pnpm --filter @arbio/shared-core build`
   - Check import paths use `dist/` not `src/`

2. **Migration Conflicts:**
   - Each service should own its own migrations
   - Don't share migration files between services

3. **TypeScript Errors:**
   - Rebuild shared-core after changes
   - Check import paths are consistent

4. **Database Connection Issues:**
   - Ensure Docker container is running: `docker-compose ps`
   - Check database credentials in `data-source.ts`

### Development Tips

- Use `pnpm --filter @arbio/shared-core dev` to watch for changes
- Use `pnpm --filter service-name dev` for service development
- Check migration status: `pnpm --filter users-service migration:show`

## Contributing

1. Make changes to shared-core
2. Build shared-core: `pnpm --filter @arbio/shared-core build`
3. Test affected services
4. Run migrations if needed
5. Update documentation

## License

This project is for educational purposes as part of the case study.