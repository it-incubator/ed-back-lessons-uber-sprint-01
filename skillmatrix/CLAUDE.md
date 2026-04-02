# GEMINI.md

## Project Overview

This is a TypeScript-based RESTful API for managing drivers and rides, built with Express.js and MongoDB.
The project follows a layered architecture, with a clear separation of concerns between routes, services, and repositories.
It uses `express-validator` for input validation and `swagger-ui-express` for API documentation.
The API responses adhere to the JSON API specification.

## Project File Structure

The following is the file and folder structure of the current project. Note that folders and files related to 'drivers' and 'rides' are domain-specific examples, illustrating the architectural principles for creating new features.

```
/Users/it-kamasutra/dev/edu/uber/vibecoding/temp-04/
├───.gitignore
├───.prettierignore
├───.prettierrc
├───eslint.config.mjs
├───jest.config.json
├───package.json
├───pnpm-lock.yaml
├───README.md
├───tsconfig.json
├───__tests__/
│   ├───e2e/
│   │   ├───drivers/
│   │   │   ├───drivers-body-validation.e2e.spec.ts
│   │   │   └───drivers.e2e.spec.ts
│   │   └───rides/
│   │       ├───rides-body-validation.e2e.spec.ts
│   │       └───rides.e2e.spec.ts
│   └───utils/
│       ├───clear-db.ts
│       ├───generate-admin-auth-token.ts
│       ├───drivers/
│       │   ├───create-driver.ts
│       │   ├───get-driver-by-id.ts
│       │   ├───get-driver-dto.ts
│       │   └───update-driver.ts
│       └───rides/
│           ├───create-ride.ts
│           ├───get-ride-by-id.ts
│           └───get-ride-dto.ts
├───.idea/
│   ├───.gitignore
│   ├───modules.xml
│   ├───prettier.xml
│   ├───temp-04.iml
│   ├───vcs.xml
│   ├───workspace.xml
│   ├───codeStyles/
│   │   ├───codeStyleConfig.xml
│   │   └───Project.xml
│   └───inspectionProfiles/
│       └───Project_Default.xml
├───node_modules/...
├───requirments/
│   ├───first-srpint-plain.puml
│   └───full-plain.puml
└───src/
    ├───index.ts
    ├───setup-app.ts
    ├───auth/
    │   └───middlewares/
    │       └───super-admin.guard-middleware.ts
    ├───core/
    │   ├───errors/
    │   │   ├───create-error-messages.ts
    │   │   ├───domain.error.ts
    │   │   ├───errors.handler.ts
    │   │   ├───repository-not-found.error.ts
    │   │   └───types/
    │   │       ├───validationError.dto.ts
    │   │       └───validationError.ts
    │   ├───helpers/
    │   │   └───set-default-sort-and-pagination.ts
    │   ├───middlewares/
    │   │   └───validation/
    │   │       ├───input-validtion-result.middleware.ts
    │   │       ├───params-id.validation-middleware.ts
    │   │       ├───query-pagination-sorting.validation-middleware.ts
    │   │       └───resource-type.validation-middleware.ts
    │   ├───paths/
    │   │   └───paths.ts
    │   ├───settings/
    │   │   └───settings.ts
    │   ├───swagger/
    │   │   └───setup-swagger.ts
    │   └───types/
    │       ├───http-statuses.ts
    │       ├───paginated.output.ts
    │       ├───pagination-and-sorting.ts
    │       ├───resource-type.ts
    │       └───sort-direction.ts
    ├───db/
    │   └───mongo.db.ts
    ├───drivers/
    │   ├───application/
    │   │   ├───drivers.service.ts
    │   │   └───dtos/
    │   │       └───driver-attributes.ts
    │   ├───docs/
    │   │   └───drivers.swagger.yml
    │   ├───domain/
    │   │   └───driver.ts
    │   ├───repositories/
    │   │   └───drivers.repository.ts
    │   └───routes/
    │       ├───driver.input-dto.validation-middlewares.ts
    │       ├───drivers.route.ts
    │       ├───handlers/
    │       │   ├───create-driver.handler.ts
    │       │   ├───delete-driver.handler.ts
    │       │   ├───get-driver-list.handler.ts
    │       │   ├───get-driver-ride-list.handler.ts
    │       │   ├───get-driver.handler.ts
    │       │   └───update-driver.handler.ts
    │       ├───input/
    │       │   ├───driver-create.input.ts
    │       │   ├───driver-query.input.ts
    │       │   ├───driver-sort-field.ts
    │       │   └───driver-update.input.ts
    │       ├───mappers/
    │       │   ├───map-to-driver-list-paginated-output.util.ts
    │       │   └───map-to-driver-output.util.ts
    │       └───output/
    │           ├───driver-data.output.ts
    │           ├───driver-list-paginated.output.ts
    │           └───driver.output.ts
    ├───rides/
    │   ├───application/
    │   │   ├───rides.service.ts
    │   │   └───dtos/
    │   │       └───ride-attributes.ts
    │   ├───docs/
    │   │   └───rides.swagger.yml
    │   ├───domain/
    │   │   └───ride.ts
    │   ├───repositories/
    │   │   └───rides.repository.ts
    │   └───routes/
    │       ├───ride.input-dto.validation-middleware.ts
    │       ├───rides.route.ts
    │       ├───handlers/
    │       │   ├───create-ride.handler.ts
    │       │   ├───finish-ride.handler.ts
    │       │   ├───get-ride-list.handler.ts
    │       │   └───get-ride.handler.ts
    │       ├───input/
    │       │   ├───ride-create.input.ts
    │       │   ├───ride-query.input.ts
    │       │   └───ride-sort-field.ts
    │       ├───mappers/
    │       │   ├───map-to-ride-list-paginated-output.util.ts
    │       │   └───map-to-ride-output.util.ts
    │       └───output/
    │           ├───ride-data.output.ts
    │           ├───ride-list-paginated.output.ts
    │           └───ride.output.ts
    └───testing/
        ├───docs/
        │   └───testing.swagger.yml
        └───routes/
            └───testing.route.ts
```

## Building and Running

### Prerequisites

*   Node.js and pnpm
*   MongoDB

### Installation

```bash
pnpm install
```

### Running the Application

To run the application in development mode with hot-reloading run this commands in seperate terminals:

```bash
pnpm watch
```

```bash
pnpm run dev
```


The application will be available at `http://localhost:5003` by default.

### Running Tests

To run the test suite:

```bash
pnpm run jest
```

## Development Conventions

### Code Style

The project uses Prettier for code formatting and ESLint for linting. To format and lint the code, run:

```bash
pnpm run format
pnpm run lint
```

#### Code Formatting

The Prettier configuration (`.prettierrc`) is as follows:

*   **Semicolons:** `true`
*   **Single Quotes:** `true`
*   **Trailing Commas:** `all`
*   **Print Width:** `80`
*   **Tab Width:** `2`

### Testing

The project uses `jest` and `supertest` for end-to-end (e2e) testing.

#### Test Structure

*   All tests are located in the `__tests__` directory.
*   E2E tests are located in the `__tests__/e2e` directory, and are further organized by resource (e.g., `drivers`, `rides`).
*   Utility functions for tests are located in the `__tests__/utils` directory.

#### Test Initialization

Before each test suite, the test database is cleared. A separate test database is used for testing, as configured in the `beforeAll` function in the test files.

```typescript
beforeAll(async () => {
  await runDB('mongodb://localhost:27017/ed-back-lessons-uber-test');
  await clearDb(app);
});

afterAll(async () => {
  await stopDb();
});
```

#### Test Utilities

The `__tests__/utils` directory contains several helpful functions for writing tests:

*   `clearDb(app)`: Clears the test database.
*   `generateBasicAuthToken()`: Generates a basic authentication token for the admin user.
*   `createDriver(app, driverDto)`: Creates a new driver via an API call.
*   `getDriverDto()`: Returns a sample driver DTO for creating new drivers.
*   `createRide(app, rideDto)`: Creates a new ride via an API call.
*   `getRideDto(driverId)`: Returns a sample ride DTO for creating new rides.

#### Writing a New E2E Test

Here is an example of how to write a new e2e test for a new resource:

`__tests__/e2e/entities/entities.e2e.spec.ts`

```typescript
// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { ENTITIES_PATH } from '../../../src/core/paths/paths';
import { clearDb } from '../../utils/clear-db';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { createEntity } from '../../utils/entities/create-entity';

describe('Entity API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB('mongodb://localhost:27017/ed-back-lessons-uber-test');
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('✅ should create entity; POST /api/entities', async () => {
    await createEntity(app, { name: 'Test Entity' });
  });

  it('✅ should return entities list; GET /api/entities', async () => {
    await Promise.all([createEntity(app), createEntity(app)]);

    const response = await request(app)
      .get(ENTITIES_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThanOrEqual(2);
  });
});
```

### API Documentation

The API is documented using Swagger. 
The documentation is automatically generated and can be accessed at `/api-docs` when the application is running.

### Architecture

The project is structured into the following layers:

*   **Routes:** Handle incoming HTTP requests, validate input, and call the appropriate service methods.
*   **Services:** Contain the business logic of the application.
*   **Repositories:** Responsible for interacting with the database.

This separation of concerns makes the codebase more modular, testable, and maintainable.

## Authentication

The API uses Basic Authentication. The default credentials are:

*   **Username:** `admin`
*   **Password:** `qwerty`

## API Endpoints

### Drivers

*   `GET /api/drivers`: Get a list of drivers with pagination and sorting.
*   `GET /api/drivers/:id`: Get a specific driver by ID.
*   `POST /api/drivers`: Create a new driver.
*   `PUT /api/drivers/:id`: Update a driver.
*   `DELETE /api/drivers/:id`: Delete a driver.
*   `GET /api/drivers/:id/rides`: Get a list of rides for a specific driver with pagination and sorting.

### Rides

*   `GET /api/rides`: Get a list of rides with pagination and sorting.
*   `GET /api/rides/:id`: Get a specific ride by ID.
*   `POST /api/rides`: Create a new ride.
*   `POST /api/rides/:id/actions/finish`: Finish a ride.

### Testing

*   `DELETE /api/testing/all-data`: Clear all data from the database.

## Code Examples

This section provides a template for creating a new resource, following the project's architecture.

### 1. Create a new entity

`src/entities/domain/entity.ts`

```typescript
export type Entity = {
  name: string;
  createdAt: Date;
};
```

### 2. Create a new repository

`src/entities/repositories/entities.repository.ts`

```typescript
import { Entity } from '../domain/entity';
import { entityCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { EntityAttributes } from '../application/dtos/entity-attributes';
import { EntityQueryInput } from '../routes/input/entity-query.input';

export const entitiesRepository = {
  async findMany(
    queryDto: EntityQueryInput,
  ): Promise<{ items: WithId<Entity>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchEntityNameTerm,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter = {
      name: { $regex: searchEntityNameTerm ?? '', $options: 'i' },
    };

    const [items, totalCount] = await Promise.all([
      entityCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      entityCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<Entity> | null> {
    return entityCollection.findOne({ _id: new ObjectId(id) });
  },

  async findByIdOrFail(id: string): Promise<WithId<Entity>> {
    const res = await entityCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError('Entity not exist');
    }
    return res;
  },

  async create(newEntity: Entity): Promise<string> {
    const insertResult = await entityCollection.insertOne(newEntity);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: EntityAttributes): Promise<void> {
    const updateResult = await entityCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: dto.name,
        },
      },
    );

    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await entityCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return;
  },
};
```

### 3. Create a new service

`src/entities/application/entities.service.ts`

```typescript
import { entitiesRepository } from '../repositories/entities.repository';
import { WithId } from 'mongodb';
import { Entity } from '../domain/entity';
import { EntityAttributes } from './dtos/entity-attributes';
import { EntityQueryInput } from '../routes/input/entity-query.input';

export const entitiesService = {
  async findMany(
    queryDto: EntityQueryInput,
  ): Promise<{ items: WithId<Entity>[]; totalCount: number }> {
    return entitiesRepository.findMany(queryDto);
  },

  async findByIdOrFail(id: string): Promise<WithId<Entity>> {
    return entitiesRepository.findByIdOrFail(id);
  },

  async create(dto: EntityAttributes): Promise<string> {
    const newEntity: Entity = {
      name: dto.name,
      createdAt: new Date(),
    };

    return entitiesRepository.create(newEntity);
  },

  async update(id: string, dto: EntityAttributes): Promise<void> {
    await entitiesRepository.findByIdOrFail(id); // throws 404 if not found
    await entitiesRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    await entitiesRepository.findByIdOrFail(id); // throws 404 if not found
    await entitiesRepository.delete(id);
    return;
  },
};
```

### 4. Create a new route

`src/entities/routes/entities.route.ts`

```typescript
import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import {
  entityCreateInputValidation,
  entityUpdateInputValidation,
} from './entity.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { getEntityListHandler } from './handlers/get-entity-list.handler';
import { getEntityHandler } from './handlers/get-entity.handler';
import { createEntityHandler } from './handlers/create-entity.handler';
import { updateEntityHandler } from './handlers/update-entity.handler';
import { deleteEntityHandler } from './handlers/delete-entity.handler';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { EntitySortField } from './input/entity-sort-field';

export const entitiesRouter = Router({});

entitiesRouter.use(superAdminGuardMiddleware);

entitiesRouter
  .get(
    '',
    paginationAndSortingValidation(EntitySortField),
    inputValidationResultMiddleware,
    getEntityListHandler,
  )

  .get('/:id', idValidation, inputValidationResultMiddleware, getEntityHandler)

  .post(
    '',
    entityCreateInputValidation,
    inputValidationResultMiddleware,
    createEntityHandler,
  )

  .put(
    '/:id',
    idValidation,
    entityUpdateInputValidation,
    inputValidationResultMiddleware,
    updateEntityHandler,
  )

  .delete(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    deleteEntityHandler,
  );
```

### 5. Create a new handler

`src/entities/routes/handlers/create-entity.handler.ts`

```typescript
import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToEntityOutput } from '../mappers/map-to-entity-output.util';
import { entitiesService } from '../../application/entities.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { EntityCreateInput } from '../input/entity-create.input';

export async function createEntityHandler(
  req: Request<{}, {}, EntityCreateInput>,
  res: Response,
) {
  try {
    const createdEntityId = await entitiesService.create(
      req.body.data.attributes,
    );

    const createdEntity = await entitiesService.findByIdOrFail(createdEntityId);

    const entityOutput = mapToEntityOutput(createdEntity);

    res.status(HttpStatus.Created).send(entityOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
```

### 6. Update `setup-app.ts`

Add the new router to `src/setup-app.ts`:

```typescript
import { entitiesRouter } from './entities/routes/entities.route';
import { ENTITIES_PATH } from './core/paths/paths';

// ...

app.use(ENTITIES_PATH, entitiesRouter);

// ...
```

### 7. Update `paths.ts`

Add the new path to `src/core/paths/paths.ts`:

```typescript
export const ENTITIES_PATH = '/api/entities';
```

### 8. Update `mongo.db.ts`

Add the new collection to `src/db/mongo.db.ts`:

```typescript
export let entityCollection: Collection<Entity>;

// ...

entityCollection = db.collection<Entity>('entities');

// ...
```
- use pnpm instead of npm