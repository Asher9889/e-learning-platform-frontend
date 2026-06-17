# Program Module API

Base URL: `/api/v1/programs`

All endpoints require **authentication** via JWT token (except where noted). Protected routes also require **authorization** roles.

---

## Program Type Enum

| Value | Description |
|-------|-------------|
| `SCHOOL` | School-level program |
| `UNDERGRADUATE` | Bachelor's degree |
| `POSTGRADUATE` | Master's degree |
| `DOCTORATE` | PhD / Doctoral |
| `CERTIFICATION` | Certificate course |
| `COACHING` | Coaching / test prep |

> **Note:** For `UNDERGRADUATE`, `POSTGRADUATE`, `DOCTORATE`, and `CERTIFICATION` types, `fullName` and `durationMonths > 0` are **required** (validated at the database level).

---

## 1. List Programs

```
GET /api/v1/programs
```

**Query Parameters** (all optional):

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number (min 1) |
| `limit` | number | `20` | Items per page (max 50) |
| `search` | string | — | Search by name, fullName, or description (case-insensitive) |
| `isActive` | boolean | — | Filter by active status (`true` / `false`) |
| `programType` | enum | — | Filter by program type |

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Programs retrieved successfully",
  "data": {
    "programs": [
      {
        "id": "664f1a2b3c4d5e6f7a8b9c0d",
        "name": "B.Sc.",
        "fullName": "Bachelor of Science in Computer Science",
        "programType": "UNDERGRADUATE",
        "description": "A comprehensive CS program",
        "durationMonths": 48,
        "isActive": true,
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "totalPrograms": 1
  }
}
```

---

## 2. Get Program by ID

```
GET /api/v1/programs/:id
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Program retrieved successfully",
  "data": {
    "id": "664f1a2b3c4d5e6f7a8b9c0d",
    "name": "B.Sc.",
    "fullName": "Bachelor of Science in Computer Science",
    "programType": "UNDERGRADUATE",
    "description": "A comprehensive CS program",
    "durationMonths": 48,
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Program not found with the provided ID",
  "errors": null
}
```

---

## 3. Create Program

```
POST /api/v1/programs
```

**Auth Required:** ADMIN, TEACHER

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **Yes** | Short program name (e.g., "B.Sc.", "M.Sc.") |
| `programType` | enum | **Yes** | One of: `SCHOOL`, `UNDERGRADUATE`, `POSTGRADUATE`, `DOCTORATE`, `CERTIFICATION`, `COACHING` |
| `fullName` | string | No* | Full program name. **Required** for higher education types |
| `description` | string | No | Max 500 characters |
| `durationMonths` | number | No* | Duration in months. **Required** for higher education types (max 120) |
| `isActive` | boolean | No | Defaults to `true` |

**Example Payload:**
```json
{
  "name": "B.Sc.",
  "fullName": "Bachelor of Science in Computer Science",
  "programType": "UNDERGRADUATE",
  "description": "A four-year undergraduate program covering computer science fundamentals",
  "durationMonths": 48,
  "isActive": true
}
```

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Program created successfully",
  "data": {
    "id": "664f1a2b3c4d5e6f7a8b9c0d",
    "name": "B.Sc.",
    "fullName": "Bachelor of Science in Computer Science",
    "programType": "UNDERGRADUATE",
    "description": "A four-year undergraduate program covering computer science fundamentals",
    "durationMonths": 48,
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error (409) — Duplicate name:**
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Program with the same name already exists",
  "errors": null
}
```

---

## 4. Update Program

```
PATCH /api/v1/programs/:id
```

**Auth Required:** ADMIN, TEACHER

**Request Body** — all fields optional, but **at least one** must be provided:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | New short name |
| `programType` | enum | New program type |
| `fullName` | string | New full name |
| `description` | string | New description (max 500 chars) |
| `durationMonths` | number | New duration in months |
| `isActive` | boolean | Toggle active status |

**Example Payload:**
```json
{
  "name": "B.Sc. CS",
  "description": "Updated description for the program"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Program updated successfully",
  "data": {
    "id": "664f1a2b3c4d5e6f7a8b9c0d",
    "name": "B.Sc. CS",
    "fullName": "Bachelor of Science in Computer Science",
    "programType": "UNDERGRADUATE",
    "description": "Updated description for the program",
    "durationMonths": 48,
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-06-16T00:00:00.000Z"
  }
}
```

---

## 5. Delete Program

```
DELETE /api/v1/programs/:id
```

**Auth Required:** ADMIN, TEACHER

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Program deleted successfully",
  "data": null
}
```

---

## Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description here",
  "errors": [
    {
      "field": "name",
      "message": "Program name is required"
    }
  ]
}
```

| Status | Meaning |
|--------|---------|
| `400` | Validation error (invalid input) |
| `401` | Unauthenticated (missing/invalid token) |
| `403` | Unauthorized (insufficient role) |
| `404` | Resource not found |
| `409` | Conflict (duplicate name) |
| `500` | Internal server error |

---

## Quick Reference

| Method | Endpoint | Auth | Roles |
|--------|----------|------|-------|
| `GET` | `/api/v1/programs` | ✅ | Any authenticated user |
| `GET` | `/api/v1/programs/:id` | ✅ | Any authenticated user |
| `POST` | `/api/v1/programs` | ✅ | ADMIN, TEACHER |
| `PATCH` | `/api/v1/programs/:id` | ✅ | ADMIN, TEACHER |
| `DELETE` | `/api/v1/programs/:id` | ✅ | ADMIN, TEACHER |
