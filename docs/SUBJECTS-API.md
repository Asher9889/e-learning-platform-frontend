# Subjects Module — API Documentation

> Base URL: `/api/v1/subjects`

---

## Data Model

### Subject (MongoDB Document)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `_id` | `ObjectId` | Auto | — | Unique identifier |
| `programId` | `ObjectId` (ref: Program) | ✅ | — | Parent program this subject belongs to |
| `name` | `String` | ✅ | — | Subject name (trimmed) |
| `normalizedName` | `String` | ✅ | — | Uppercase copy of `name` for unique checks (hidden from queries) |
| `description` | `String` | — | `""` | Subject description |
| `isActive` | `Boolean` | — | `true` | Soft status flag |
| `createdAt` | `Date` | Auto | — | Timestamp |
| `updatedAt` | `Date` | Auto | — | Timestamp |

**Indexes:**
- `{ programId: 1 }` — single field
- `{ programId: 1, normalizedName: 1 }` — **unique compound** (prevents duplicate names within same program)

### Response Envelope

All API responses follow this structure:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": { /* payload */ }
}
```

Error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "...",
  "errors": []
}
```

---

## Authentication & Authorization

- **Auth required:** All endpoints require a valid JWT `Bearer` token in the `Authorization` header.
- **Roles:**
  - `ADMIN` — full access
  - `TEACHER` — full access (same as ADMIN for subjects)
  - `STUDENT` — read-only access (GET endpoints only)

---

## API Endpoints

---

### 1. List Subjects

```
GET /api/v1/subjects
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | `number` | `1` | Page number (min 1) |
| `limit` | `number` | `20` | Items per page (max 50) |
| `search` | `string` | — | Search by `name` or `description` (case-insensitive regex) |
| `isActive` | `boolean` | — | Filter by active status |
| `programId` | `string` | — | Filter by program ID |

**Example Request:**

```
GET /api/v1/subjects?page=1&limit=10&programId=65abc123...
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Subjects retrieved successfully",
  "data": {
    "subjects": [
      {
        "id": "664a1b2c3d4e5f6a7b8c9d0e",
        "programId": "664a1b2c3d4e5f6a7b8c9d0a",
        "name": "Mathematics",
        "description": "Advanced algebra and calculus",
        "isActive": true,
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "totalSubjects": 25
  }
}
```

---

### 2. Get Subject by ID

```
GET /api/v1/subjects/:id
```

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | `string` | MongoDB ObjectId of the subject |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Subject retrieved successfully",
  "data": {
    "id": "664a1b2c3d4e5f6a7b8c9d0e",
    "programId": "664a1b2c3d4e5f6a7b8c9d0a",
    "name": "Mathematics",
    "description": "Advanced algebra and calculus",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Subject not found with the provided ID",
  "errors": []
}
```

---

### 3. Create Subject

```
POST /api/v1/subjects
```

**Required Role:** `ADMIN` or `TEACHER`

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `programId` | `string` | ✅ | — | Valid MongoDB ObjectId of an existing Program |
| `name` | `string` | ✅ | — | 1–100 characters |
| `description` | `string` | — | — | Max 500 characters |
| `isActive` | `boolean` | — | `true` | — |

**Example Request Body:**

```json
{
  "programId": "664a1b2c3d4e5f6a7b8c9d0a",
  "name": "Physics",
  "description": "Core physics including mechanics and thermodynamics"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Subject created successfully",
  "data": {
    "id": "664a1b2c3d4e5f6a7b8c9d0e",
    "programId": "664a1b2c3d4e5f6a7b8c9d0a",
    "name": "Physics",
    "description": "Core physics including mechanics and thermodynamics",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Condition |
|--------|-----------|
| `400` | Program ID is invalid or Program does not exist |
| `409` | A subject with the same name already exists in this program |

---

### 4. Update Subject

```
PATCH /api/v1/subjects/:id
```

**Required Role:** `ADMIN` or `TEACHER`

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | `string` | MongoDB ObjectId of the subject |

**Request Body (at least one field required):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | — | 1–100 characters |
| `description` | `string` | — | Max 500 characters |
| `isActive` | `boolean` | — | — |

**Example Request Body:**

```json
{
  "name": "Advanced Physics",
  "description": "Updated description"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Subject updated successfully",
  "data": {
    "id": "664a1b2c3d4e5f6a7b8c9d0e",
    "programId": "664a1b2c3d4e5f6a7b8c9d0a",
    "name": "Advanced Physics",
    "description": "Updated description",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-02T00:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Condition |
|--------|-----------|
| `404` | Subject not found |
| `409` | Another subject with the same name already exists |

---

### 5. Delete Subject

```
DELETE /api/v1/subjects/:id
```

**Required Role:** `ADMIN` or `TEACHER`

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | `string` | MongoDB ObjectId of the subject |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Subject deleted successfully",
  "data": null
}
```

**Error Response (404):**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Subject not found with the provided ID",
  "errors": []
}
```

---

## Relationships

```
Program (programs collection)
  │
  │ programId
  ▼
Subject (subjects collection) ←── Material (subjectId)
  │
  │ subjectId
  ▼
LiveClass (live-classes collection)

Grade module uses CLASSES_GRADES constant from this module
```

- **Program → Subject:** Many-to-One. Each subject belongs to exactly one program. Deleting a program does **not** cascade-delete subjects (handled at application level).
- **Subject → Material:** One-to-Many. Materials can reference a subject via `subjectId`.
- **Subject → LiveClass:** One-to-Many. Live classes reference a subject via `subjectId`.

---

## Constants

```typescript
export const CLASSES_GRADES = [
    '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
    '11th Grade', '12th Grade', 'Undergraduate', 'Postgraduate'
] as const;
```

These grade names are used by the **Grade** module to validate grade-level inputs.

---

## Error Codes Summary

| HTTP Status | Meaning |
|-------------|---------|
| `200` | Success (GET, PATCH, DELETE) |
| `201` | Created (POST) |
| `400` | Bad request (invalid ObjectId, missing fields, validation failure) |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (role not authorized) |
| `404` | Resource not found |
| `409` | Conflict (duplicate subject name within program) |
| `500` | Internal server error |
