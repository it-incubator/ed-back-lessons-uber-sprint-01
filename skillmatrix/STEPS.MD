# Implementation Plan: Skill Matrix Management System

##   Contradictions Between Specification and PUML

### 1. Category Relationship Model
- **Specification**: One-to-many (Category belongs to one Matrix)
  - `Category` has `matrix_id` foreign key
- **PUML**: Many-to-many (Category can be shared across Matrices)
  - Introduces `MatrixCategory` junction table
  - `Category` is independent, linked via `MatrixCategory`
- **Decision**: Follow PUML (higher priority) - use junction table

### 2. Grade & KnowledgeLevel Implementation
- **Specification**: Separate reference tables (`Grade`, `KnowledgeLevel`)
- **PUML**: Enums embedded in `Requirement` and `SubtopicSkill`
- **Decision**: Follow PUML - use enums

### 3. Resource Relationship
- **Specification**: Many-to-many via `SkillResource` junction table
  - One resource can be linked to multiple skills
- **PUML**: One-to-many (Resource belongs to one Skill)
  - `Resource` has `skill_id` foreign key
- **Decision**: Follow PUML - direct foreign key

---

## <¯ Implementation Order

Following the hierarchy from top to bottom:
1. SkillMatrix (root entity)
2. Category (independent, reusable)
3. MatrixCategory (junction table for Matrix ” Category)
4. Topic (belongs to Category)
5. Subtopic (belongs to Topic)
6. Skill (independent, reusable)
7. SubtopicSkill (junction table for Subtopic ” Skill)
8. Requirement (belongs to Subtopic, defines grade requirements)
9. Resource (belongs to Skill)

---

## =Ë Step-by-Step Implementation Plan

### Phase 1: SkillMatrix Entity

#### Step 1.1: Create Domain Model
- **File**: `src/skill-matrices/domain/skill-matrix.ts`
- **Fields**:
  ```typescript
  {
    title: string;
    description: string;
    is_published: boolean;
    createdAt: Date;
  }
  ```

#### Step 1.2: Create Repository
- **File**: `src/skill-matrices/repositories/skill-matrices.repository.ts`
- **Methods**:
  - `findMany(queryDto)` - with pagination, sorting, search by title
  - `findById(id)`
  - `findByIdOrFail(id)`
  - `create(newMatrix)`
  - `update(id, dto)`
  - `delete(id)`

#### Step 1.3: Create Application Layer
- **File**: `src/skill-matrices/application/skill-matrices.service.ts`
- **File**: `src/skill-matrices/application/dtos/skill-matrix-attributes.ts`
- Implement service methods that use repository

#### Step 1.4: Create Route Layer
- **Files**:
  - `src/skill-matrices/routes/skill-matrices.route.ts`
  - `src/skill-matrices/routes/input/skill-matrix-create.input.ts`
  - `src/skill-matrices/routes/input/skill-matrix-update.input.ts`
  - `src/skill-matrices/routes/input/skill-matrix-query.input.ts`
  - `src/skill-matrices/routes/input/skill-matrix-sort-field.ts`
  - `src/skill-matrices/routes/output/skill-matrix.output.ts`
  - `src/skill-matrices/routes/output/skill-matrix-data.output.ts`
  - `src/skill-matrices/routes/output/skill-matrix-list-paginated.output.ts`
  - `src/skill-matrices/routes/skill-matrix.input-dto.validation-middlewares.ts`
  - `src/skill-matrices/routes/mappers/map-to-skill-matrix-output.util.ts`
  - `src/skill-matrices/routes/mappers/map-to-skill-matrix-list-paginated-output.util.ts`

#### Step 1.5: Create Handlers
- **Files** (in `src/skill-matrices/routes/handlers/`):
  - `get-skill-matrix-list.handler.ts`
  - `get-skill-matrix.handler.ts`
  - `create-skill-matrix.handler.ts`
  - `update-skill-matrix.handler.ts`
  - `delete-skill-matrix.handler.ts`

#### Step 1.6: Add MongoDB Collection
- **File**: `src/db/mongo.db.ts`
- Add: `export let skillMatrixCollection: Collection<SkillMatrix>;`
- Initialize in `runDB()`

#### Step 1.7: Update Paths
- **File**: `src/core/paths/paths.ts`
- Add: `export const SKILL_MATRICES_PATH = '/api/skill-matrices';`

#### Step 1.8: Register Router
- **File**: `src/setup-app.ts`
- Import and register `skillMatricesRouter`

#### Step 1.9: Add Swagger Documentation
- **File**: `src/skill-matrices/docs/skill-matrices.swagger.yml`
- Document all endpoints

#### Step 1.10: Write E2E Tests
- **Files**:
  - `__tests__/e2e/skill-matrices/skill-matrices.e2e.spec.ts`
  - `__tests__/e2e/skill-matrices/skill-matrices-body-validation.e2e.spec.ts`
  - `__tests__/utils/skill-matrices/create-skill-matrix.ts`
  - `__tests__/utils/skill-matrices/get-skill-matrix-by-id.ts`
  - `__tests__/utils/skill-matrices/get-skill-matrix-dto.ts`
  - `__tests__/utils/skill-matrices/update-skill-matrix.ts`

---

### Phase 2: Category Entity

#### Step 2.1: Create Domain Model
- **File**: `src/categories/domain/category.ts`
- **Fields**:
  ```typescript
  {
    name: string;
    createdAt: Date;
  }
  ```
- **Note**: No `matrix_id` here (different from spec!)

#### Step 2.2: Create Repository
- **File**: `src/categories/repositories/categories.repository.ts`
- **Methods**: Standard CRUD (findMany, findById, findByIdOrFail, create, update, delete)

#### Step 2.3: Create Application Layer
- **File**: `src/categories/application/categories.service.ts`
- **File**: `src/categories/application/dtos/category-attributes.ts`

#### Step 2.4: Create Route Layer
- Similar structure to SkillMatrix
- **Base path**: `/api/categories`

#### Step 2.5: Create Handlers
- Standard CRUD handlers

#### Step 2.6: Update MongoDB, Paths, Router
- Add collection, path constant, register router

#### Step 2.7: Add Swagger Documentation

#### Step 2.8: Write E2E Tests

---

### Phase 3: MatrixCategory Junction Table

#### Step 3.1: Create Domain Model
- **File**: `src/matrix-categories/domain/matrix-category.ts`
- **Fields**:
  ```typescript
  {
    matrix_id: ObjectId;
    category_id: ObjectId;
    order_index: number;
  }
  ```

#### Step 3.2: Create Repository
- **File**: `src/matrix-categories/repositories/matrix-categories.repository.ts`
- **Methods**:
  - `findByMatrixId(matrixId)` - get all categories for a matrix
  - `create(matrixId, categoryId, orderIndex)`
  - `update(matrixId, categoryId, orderIndex)`
  - `delete(matrixId, categoryId)`
  - `deleteByMatrixId(matrixId)` - cleanup when matrix is deleted

#### Step 3.3: Create Application Layer
- **File**: `src/matrix-categories/application/matrix-categories.service.ts`

#### Step 3.4: Create Route Handlers
- Add endpoints to SkillMatrix routes:
  - `GET /api/skill-matrices/:id/categories` - get categories for matrix
  - `POST /api/skill-matrices/:id/categories` - link category to matrix
  - `PUT /api/skill-matrices/:id/categories/:categoryId` - update order
  - `DELETE /api/skill-matrices/:id/categories/:categoryId` - unlink category

#### Step 3.5: Update SkillMatrix Service
- Add cascade delete logic: when deleting matrix, remove all MatrixCategory links

#### Step 3.6: Update MongoDB Collection

#### Step 3.7: Add Tests

---

### Phase 4: Topic Entity

#### Step 4.1: Create Domain Model
- **File**: `src/topics/domain/topic.ts`
- **Fields**:
  ```typescript
  {
    category_id: ObjectId;
    name: string;
    order_index: number;
    createdAt: Date;
  }
  ```

#### Step 4.2: Create Repository
- **File**: `src/topics/repositories/topics.repository.ts`
- **Methods**:
  - Standard CRUD
  - `findByCategoryId(categoryId)` - get topics for category

#### Step 4.3: Create Application Layer
- **File**: `src/topics/application/topics.service.ts`

#### Step 4.4: Create Route Layer
- **Base path**: `/api/topics`
- Also add nested route: `/api/categories/:id/topics`

#### Step 4.5: Create Handlers

#### Step 4.6: Update Category Service
- Add cascade delete: when deleting category, check if topics exist (prevent or cascade)

#### Step 4.7: Update MongoDB, Paths, Router

#### Step 4.8: Add Swagger Documentation

#### Step 4.9: Write E2E Tests

---

### Phase 5: Subtopic Entity

#### Step 5.1: Create Domain Model
- **File**: `src/subtopics/domain/subtopic.ts`
- **Fields**:
  ```typescript
  {
    topic_id: ObjectId;
    name: string;
    description: string;
    createdAt: Date;
  }
  ```

#### Step 5.2: Create Repository
- **File**: `src/subtopics/repositories/subtopics.repository.ts`
- **Methods**:
  - Standard CRUD
  - `findByTopicId(topicId)`

#### Step 5.3: Create Application Layer

#### Step 5.4: Create Route Layer
- **Base path**: `/api/subtopics`
- Nested route: `/api/topics/:id/subtopics`

#### Step 5.5: Create Handlers

#### Step 5.6: Update Topic Service
- Add cascade delete logic

#### Step 5.7: Update MongoDB, Paths, Router

#### Step 5.8: Add Swagger Documentation

#### Step 5.9: Write E2E Tests

---

### Phase 6: Skill Entity

#### Step 6.1: Create Domain Model
- **File**: `src/skills/domain/skill.ts`
- **Fields**:
  ```typescript
  {
    description: string;
    type: 'theory' | 'practical' | 'soft';
    createdAt: Date;
  }
  ```

#### Step 6.2: Create Type Enum
- **File**: `src/skills/domain/skill-type.enum.ts`
- Export enum for skill types

#### Step 6.3: Create Repository
- **File**: `src/skills/repositories/skills.repository.ts`
- Standard CRUD methods

#### Step 6.4: Create Application Layer

#### Step 6.5: Create Route Layer
- **Base path**: `/api/skills`

#### Step 6.6: Create Handlers

#### Step 6.7: Update MongoDB, Paths, Router

#### Step 6.8: Add Swagger Documentation

#### Step 6.9: Write E2E Tests

---

### Phase 7: SubtopicSkill Junction Table

#### Step 7.1: Create Domain Model
- **File**: `src/subtopic-skills/domain/subtopic-skill.ts`
- **Fields**:
  ```typescript
  {
    subtopic_id: ObjectId;
    skill_id: ObjectId;
    required_level: 'none' | 'novice' | 'intern' | 'advanced';
  }
  ```

#### Step 7.2: Create Enum
- **File**: `src/subtopic-skills/domain/knowledge-level.enum.ts`

#### Step 7.3: Create Repository
- **File**: `src/subtopic-skills/repositories/subtopic-skills.repository.ts`
- **Methods**:
  - `findBySubtopicId(subtopicId)`
  - `findBySkillId(skillId)`
  - `create(subtopicId, skillId, requiredLevel)`
  - `update(subtopicId, skillId, requiredLevel)`
  - `delete(subtopicId, skillId)`

#### Step 7.4: Create Application Layer

#### Step 7.5: Create Route Handlers
- Nested routes under Subtopic:
  - `GET /api/subtopics/:id/skills`
  - `POST /api/subtopics/:id/skills`
  - `PUT /api/subtopics/:id/skills/:skillId`
  - `DELETE /api/subtopics/:id/skills/:skillId`

#### Step 7.6: Update Subtopic Service
- Add cascade delete logic

#### Step 7.7: Update MongoDB Collection

#### Step 7.8: Add Tests

---

### Phase 8: Requirement Entity

#### Step 8.1: Create Domain Model
- **File**: `src/requirements/domain/requirement.ts`
- **Fields**:
  ```typescript
  {
    subtopic_id: ObjectId;
    grade: 'J1' | 'J2' | 'J3' | 'M1' | 'M2' | 'M3' | 'S1' | 'S2' | 'S3';
    required_level: 'none' | 'novice' | 'intern' | 'advanced';
  }
  ```

#### Step 8.2: Create Enums
- **File**: `src/requirements/domain/grade.enum.ts`
- **File**: `src/requirements/domain/knowledge-level.enum.ts` (or reuse from SubtopicSkill)

#### Step 8.3: Create Repository
- **File**: `src/requirements/repositories/requirements.repository.ts`
- **Methods**:
  - `findBySubtopicId(subtopicId)`
  - `create(requirement)`
  - `update(subtopicId, grade, requiredLevel)`
  - `delete(subtopicId, grade)`

#### Step 8.4: Create Application Layer

#### Step 8.5: Create Route Handlers
- Nested routes under Subtopic:
  - `GET /api/subtopics/:id/requirements`
  - `POST /api/subtopics/:id/requirements`
  - `PUT /api/subtopics/:id/requirements/:grade`
  - `DELETE /api/subtopics/:id/requirements/:grade`

#### Step 8.6: Update MongoDB Collection

#### Step 8.7: Add Tests

---

### Phase 9: Resource Entity

#### Step 9.1: Create Domain Model
- **File**: `src/resources/domain/resource.ts`
- **Fields**:
  ```typescript
  {
    skill_id: ObjectId;
    title: string;
    url: string;
    note: string;
    createdAt: Date;
  }
  ```

#### Step 9.2: Create Repository
- **File**: `src/resources/repositories/resources.repository.ts`
- **Methods**:
  - Standard CRUD
  - `findBySkillId(skillId)`

#### Step 9.3: Create Application Layer

#### Step 9.4: Create Route Layer
- **Base path**: `/api/resources`
- Nested route: `/api/skills/:id/resources`

#### Step 9.5: Create Handlers

#### Step 9.6: Update Skill Service
- Add cascade delete logic

#### Step 9.7: Update MongoDB, Paths, Router

#### Step 9.8: Add Swagger Documentation

#### Step 9.9: Write E2E Tests

---

## >ê Phase 10: Integration Testing

### Step 10.1: Full Flow Tests
- Create a complete skill matrix with all nested entities
- Test cascade deletions
- Test complex queries (e.g., get all skills for a matrix through the hierarchy)

### Step 10.2: Validation Tests
- Test all validation rules
- Test edge cases (empty strings, invalid enums, etc.)

### Step 10.3: Performance Tests
- Test pagination with large datasets
- Test queries with multiple joins

---

## =Ú Phase 11: Documentation

### Step 11.1: Update README
- Add API endpoints for all new entities
- Add usage examples

### Step 11.2: Complete Swagger Documentation
- Ensure all endpoints are documented
- Add request/response examples

### Step 11.3: Add Code Comments
- Document complex business logic
- Add JSDoc comments for public methods

---

## = Phase 12: Refactoring & Optimization

### Step 12.1: DRY Improvements
- Extract common patterns
- Create shared utilities for junction tables

### Step 12.2: Error Handling
- Ensure consistent error responses
- Add meaningful error messages

### Step 12.3: Code Review
- Run linter and fix issues
- Format code with Prettier
- Review for security vulnerabilities

---

## <‰ Phase 13: Deployment Preparation

### Step 13.1: Environment Configuration
- Set up production environment variables
- Configure MongoDB for production

### Step 13.2: Seed Data
- Create seed script for grades and knowledge levels
- Create sample skill matrices for testing

### Step 13.3: Final Testing
- Run all tests
- Manual testing of all endpoints
- Test with production-like data

---

## =Ê Summary

**Total Entities**: 9
- **Root**: SkillMatrix (1)
- **Independent**: Category (1), Skill (1)
- **Hierarchical**: Topic (1), Subtopic (1)
- **Junction Tables**: MatrixCategory (1), SubtopicSkill (1), Requirement (1)
- **Dependent**: Resource (1)

**Estimated Steps**: ~120 implementation tasks

**Key Decisions**:
1. Follow PUML for data model (many-to-many Category ” Matrix)
2. Use enums instead of reference tables for grades and knowledge levels
3. Direct foreign key for Resource ’ Skill relationship
4. Implement cascade deletion for data integrity
5. Follow existing project architecture pattern consistently