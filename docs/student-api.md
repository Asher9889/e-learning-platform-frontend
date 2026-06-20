# Student Module API

Base URL: `/api/v1/users`

All endpoints require **authentication** via JWT token (access token in httpOnly cookie).

> **Note:** Students are stored in the `users` collection with `role: "STUDENT"`. All student endpoints live under `/api/v1/users`.

---

## Data Model

### User (Student) Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | MongoDB ObjectId |
| `email` | string | Unique email address |
| `phoneNumber` | string | Unique phone number (E.164 format) |
| `role` | string | Always `"STUDENT"` |
| `status` | enum | `ACTIVE` \| `INACTIVE` \| `SUSPENDED` \| `DELETED` |
| `personalInfo.name` | string | Student's full name |
| `personalInfo.dateOfBirth` | string | ISO date (YYYY-MM-DD) |
| `personalInfo.gender` | enum | `MALE` \| `FEMALE` \| `OTHER` |
| `personalInfo.profileImage` | string | Object key (minio), full URL returned in API |
| `personalInfo.address` | object | `{ line1, city, state, country, zipCode }` |
| `roleInfo.rollNumber` | string | Roll number |
| `roleInfo.batchId` | ObjectId | Reference to Batch |
| `roleInfo.admissionDate` | string | Admission date |
| `roleInfo.guardianName` | string | Guardian's name |
| `roleInfo.guardianPhoneNumber` | string | Guardian's phone (E.164) |
| `createdAt` | string | ISO timestamp |
| `updatedAt` | string | ISO timestamp |

### Hierarchy

```
Program
 └─ Batch
     └─ Student (User)
```

---

## 1. List Students

```
GET /api/v1/users/students
```

**Query Parameters:**

| Param | Type | Default | Required | Description |
|-------|------|---------|----------|-------------|
| `page` | number | `1` | No | Page number (min 1) |
| `limit` | number | `20` | No | Items per page (max 50) |
| `search` | string | — | No | Search across name, email, phone, roll number (case-insensitive) |
| `programId` | string | — | No | Filter by Program ID |
| `batchId` | string | — | No | Filter by Batch ID |
| `status` | enum | — | No | Filter by status: `ACTIVE` \| `INACTIVE` \| `SUSPENDED` \| `DELETED` |
| `sortBy` | enum | `createdAt` | No | Sort field: `name` \| `createdAt` \| `email` |
| `sortOrder` | enum | `desc` | No | Sort direction: `asc` \| `desc` |

**Example Requests:**

```
GET /api/v1/users/students?page=1&limit=20
GET /api/v1/users/students?programId=664f1a2b3c4d5e6f7a8b9c0d
GET /api/v1/users/students?programId=664f1a2b3c4d5e6f7a8b9c0d&batchId=664f1a2b3c4d5e6f7a8b9c0d
GET /api/v1/users/students?search=john
GET /api/v1/users/students?status=ACTIVE
GET /api/v1/users/students?sortBy=name&sortOrder=asc
GET /api/v1/users/students?programId=xxx&batchId=yyy&status=ACTIVE&search=john&page=1&limit=10&sortBy=name&sortOrder=asc
```

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Students retrieved successfully",
  "data": {
    "students": [
      {
        "id": "664f1a2b3c4d5e6f7a8b9c0d",
        "email": "john.doe@example.com",
        "phoneNumber": "+919876543210",
        "role": "STUDENT",
        "status": "ACTIVE",
        "personalInfo": {
          "name": "John Doe",
          "dateOfBirth": "2000-05-15",
          "gender": "MALE",
          "profileImage": "https://minio.example.com/lms-bucket/uploads/avatars/john.jpg",
          "address": {
            "line1": "123 Main St",
            "city": "Mumbai",
            "state": "Maharashtra",
            "country": "India",
            "zipCode": "400001"
          }
        },
        "roleInfo": {
          "rollNumber": "CS2025001",
          "admissionDate": "2025-06-01T00:00:00.000Z",
          "guardianName": "Jane Doe",
          "guardianPhoneNumber": "+919876543211",
          "batchId": "664f1a2b3c4d5e6f7a8b9c0e",
          "batchName": "Batch A",
          "programId": "664f1a2b3c4d5e6f7a8b9c0f",
          "programName": "B.Sc. Computer Science"
        },
        "createdAt": "2025-06-01T10:30:00.000Z",
        "updatedAt": "2025-06-15T14:20:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### UI Table Column Mapping

| Column | JSON Field |
|--------|------------|
| Profile Image | `personalInfo.profileImage` (full URL or `null`) |
| Student Name | `personalInfo.name` |
| Email | `email` |
| Phone Number | `phoneNumber` |
| Program | `roleInfo.programName` |
| Batch | `roleInfo.batchName` |
| Roll Number | `roleInfo.rollNumber` |
| Status | `status` |
| Created Date | `createdAt` |

---

## 2. Get Single Student

```
GET /api/v1/users/students/:id
```

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | MongoDB ObjectId of the student |

**Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Student retrieved successfully",
  "data": {
    "id": "664f1a2b3c4d5e6f7a8b9c0d",
    "email": "john.doe@example.com",
    "phoneNumber": "+919876543210",
    "role": "STUDENT",
    "status": "ACTIVE",
    "personalInfo": {
      "name": "John Doe",
      "dateOfBirth": "2000-05-15",
      "gender": "MALE",
      "profileImage": "https://minio.example.com/lms-bucket/uploads/avatars/john.jpg",
      "address": {
        "line1": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "zipCode": "400001"
      }
    },
    "roleInfo": {
      "rollNumber": "CS2025001",
      "admissionDate": "2025-06-01T00:00:00.000Z",
      "guardianName": "Jane Doe",
      "guardianPhoneNumber": "+919876543211",
      "batchId": "664f1a2b3c4d5e6f7a8b9c0e",
      "batchName": "Batch A",
      "programId": "664f1a2b3c4d5e6f7a8b9c0f",
      "programName": "B.Sc. Computer Science"
    },
    "createdAt": "2025-06-01T10:30:00.000Z",
    "updatedAt": "2025-06-15T14:20:00.000Z"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Student not found",
  "errors": null
}
```

**Frontend Usage:**
- Student profile drawer (right-side drawer)
- Pre-fill edit form

---

## 3. Create Student

```
POST /api/v1/users/students
```

**Auth Required:** ADMIN, TEACHER

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | **Yes** | Valid email address |
| `phoneNumber` | string | **Yes** | Indian phone number (10 digits) |
| `password` | string | **Yes** | Min 6 characters |
| `confirmPassword` | string | **Yes** | Must match `password` |
| `personalInfo.name` | string | **Yes** | Student's full name (2-100 chars) |
| `personalInfo.dateOfBirth` | string | **Yes** | ISO date (YYYY-MM-DD) |
| `personalInfo.gender` | enum | **Yes** | `MALE` \| `FEMALE` \| `OTHER` |
| `personalInfo.profileImage` | string | No | URL or storage path |
| `personalInfo.address.city` | string | **Yes** | City name |
| `personalInfo.address.state` | string | **Yes** | State name |
| `personalInfo.address.zipCode` | string | **Yes** | Min 6 characters |
| `personalInfo.address.line1` | string | No | Address line 1 |
| `personalInfo.address.country` | string | No | Defaults to `"India"` |
| `roleInfo.rollNumber` | string | **Yes** | Roll number |
| `roleInfo.batchId` | string | **Yes** | Valid Batch ObjectId |
| `roleInfo.admissionDate` | string | **Yes** | ISO date (YYYY-MM-DD) |
| `roleInfo.guardianName` | string | **Yes** | Guardian's full name |
| `roleInfo.guardianPhoneNumber` | string | **Yes** | Indian phone number (10 digits) |

**Example Payload:**
```json
{
  "email": "john.doe@example.com",
  "phoneNumber": "9876543210",
  "password": "password123",
  "confirmPassword": "password123",
  "personalInfo": {
    "name": "John Doe",
    "dateOfBirth": "2000-05-15",
    "gender": "MALE",
    "address": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001"
    }
  },
  "roleInfo": {
    "rollNumber": "CS2025001",
    "batchId": "664f1a2b3c4d5e6f7a8b9c0e",
    "admissionDate": "2025-06-01",
    "guardianName": "Jane Doe",
    "guardianPhoneNumber": "9876543211"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Student created successfully",
  "data": {
    "id": "664f1a2b3c4d5e6f7a8b9c0d",
    "email": "john.doe@example.com",
    "phoneNumber": "+919876543210",
    "role": "STUDENT",
    "status": "ACTIVE",
    "personalInfo": {
      "name": "John Doe",
      "dateOfBirth": "2000-05-15",
      "gender": "MALE",
      "address": {
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "zipCode": "400001"
      }
    },
    "roleInfo": {
      "rollNumber": "CS2025001",
      "batchId": "664f1a2b3c4d5e6f7a8b9c0e",
      "admissionDate": "2025-06-01T00:00:00.000Z",
      "guardianName": "Jane Doe",
      "guardianPhoneNumber": "+919876543211"
    },
    "createdAt": "2025-06-18T10:30:00.000Z",
    "updatedAt": "2025-06-18T10:30:00.000Z"
  }
}
```

---

## 4. Update Student

```
PATCH /api/v1/users/students/:id
```

**Auth Required:** ADMIN, TEACHER

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | MongoDB ObjectId of the student |

**Request Body** — all fields optional; only send changed fields.

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Valid email address |
| `phoneNumber` | string | Indian phone number (10 digits) |
| `personalInfo.name` | string | Student's full name (2-100 chars) |
| `personalInfo.dateOfBirth` | string | ISO date (YYYY-MM-DD) |
| `personalInfo.gender` | enum | `MALE` \| `FEMALE` \| `OTHER` |
| `personalInfo.profileImage` | string | URL or storage path |
| `personalInfo.address.line1` | string | Address line 1 |
| `personalInfo.address.city` | string | City name |
| `personalInfo.address.state` | string | State name |
| `personalInfo.address.country` | string | Country name |
| `personalInfo.address.zipCode` | string | Zip code (min 6) |
| `roleInfo.rollNumber` | string | Roll number |
| `roleInfo.batchId` | string | Valid Batch ObjectId |
| `roleInfo.admissionDate` | string | ISO date (YYYY-MM-DD) |
| `roleInfo.guardianName` | string | Guardian's full name |
| `roleInfo.guardianPhoneNumber` | string | Indian phone number (10 digits) |

**Example Payload:**
```json
{
  "personalInfo": {
    "name": "John Updated",
    "address": {
      "city": "Delhi"
    }
  },
  "roleInfo": {
    "rollNumber": "CS2025001-UPD"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Student updated successfully",
  "data": {
    "id": "664f1a2b3c4d5e6f7a8b9c0d",
    "email": "john.doe@example.com",
    "phoneNumber": "+919876543210",
    "role": "STUDENT",
    "status": "ACTIVE",
    "personalInfo": {
      "name": "John Updated",
      "dateOfBirth": "2000-05-15",
      "gender": "MALE",
      "profileImage": "https://minio.example.com/lms-bucket/uploads/avatars/john.jpg",
      "address": {
        "line1": "123 Main St",
        "city": "Delhi",
        "state": "Maharashtra",
        "country": "India",
        "zipCode": "400001"
      }
    },
    "roleInfo": {
      "rollNumber": "CS2025001-UPD",
      "admissionDate": "2025-06-01T00:00:00.000Z",
      "guardianName": "Jane Doe",
      "guardianPhoneNumber": "+919876543211",
      "batchId": "664f1a2b3c4d5e6f7a8b9c0e",
      "batchName": "Batch A",
      "programId": "664f1a2b3c4d5e6f7a8b9c0f",
      "programName": "B.Sc. Computer Science"
    },
    "createdAt": "2025-06-01T10:30:00.000Z",
    "updatedAt": "2025-06-15T14:20:00.000Z"
  }
}
```

**Frontend Usage:**
- Edit Student action in dropdown menu
- Opens a pre-filled edit form/dialog
- Fetch current data via `GET /students/:id` first, then send partial updates

---

## 5. Delete Student

```
DELETE /api/v1/users/students/:id
```

**Auth Required:** ADMIN

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | MongoDB ObjectId of the student |

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Student deleted successfully",
  "data": null
}
```

**Error (404):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Student not found",
  "errors": null
}
```

**Frontend Usage:**
- Delete Student action in dropdown menu
- Confirmation dialog before sending request
- On success, remove student from list and invalidate query cache

---

## 6. Change Student Status

```
PATCH /api/v1/users/students/:id/status
```

**Auth Required:** ADMIN, TEACHER

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | MongoDB ObjectId of the student |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | enum | **Yes** | New status: `ACTIVE` \| `INACTIVE` \| `SUSPENDED` |

**Example Payload:**
```json
{
  "status": "INACTIVE"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Student status updated to INACTIVE",
  "data": {
    "id": "664f1a2b3c4d5e6f7a8b9c0d",
    "status": "INACTIVE"
  }
}
```

**Frontend Usage:**
- Deactivate / Activate / Suspend action in dropdown menu
- On success, refresh the student list

---

## 7. Bulk Status Update

```
PATCH /api/v1/users/students/bulk/status
```

**Auth Required:** ADMIN, TEACHER

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `studentIds` | string[] | **Yes** | Array of student ObjectIds (min 1) |
| `status` | enum | **Yes** | Target status: `ACTIVE` \| `INACTIVE` \| `SUSPENDED` |

**Example Payload:**
```json
{
  "studentIds": [
    "664f1a2b3c4d5e6f7a8b9c0d",
    "664f1a2b3c4d5e6f7a8b9c0e",
    "664f1a2b3c4d5e6f7a8b9c0f"
  ],
  "status": "ACTIVE"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "3 students updated to ACTIVE",
  "data": {
    "updatedCount": 3
  }
}
```

**Frontend Usage:**
- Bulk action bar: "Activate" / "Deactivate" buttons when checkboxes are selected
- On success, clear selection and refresh the student list

---

## 8. Reset Student Password

```
POST /api/v1/users/students/:id/reset-password
```

**Auth Required:** ADMIN

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | MongoDB ObjectId of the student |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `newPassword` | string | **Yes** | New password (min 8 characters) |

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset successfully",
  "data": null
}
```

**Frontend Usage:**
- Reset Password action in dropdown menu
- Shows a confirmation dialog before sending

---

## 9. Get Student Statistics

```
GET /api/v1/users/students/stats
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Students stats retrieved successfully",
  "data": {
    "totalStudents": 150,
    "activeStudents": 120,
    "inactiveStudents": 20,
    "newlyAddedThisMonth": 8
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `totalStudents` | number | Total number of students |
| `activeStudents` | number | Students with status `ACTIVE` |
| `inactiveStudents` | number | Students with status `INACTIVE` |
| `newlyAddedThisMonth` | number | Students created since the 1st of the current month |

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
      "field": "batchId",
      "message": "Please provide a valid batch ID"
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
| `409` | Conflict (duplicate email or phone) |
| `500` | Internal server error |

---

## Quick Reference

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| `GET` | `/api/v1/users/students` | ✅ | Any | Paginated, filterable, sortable student list |
| `GET` | `/api/v1/users/students/:id` | ✅ | Any | Get single student profile |
| `POST` | `/api/v1/users/students` | ✅ | ADMIN, TEACHER | Create a new student |
| `PATCH` | `/api/v1/users/students/:id` | ✅ | ADMIN, TEACHER | Update student fields |
| `DELETE` | `/api/v1/users/students/:id` | ✅ | ADMIN | Delete student |
| `PATCH` | `/api/v1/users/students/:id/status` | ✅ | ADMIN, TEACHER | Change student status |
| `PATCH` | `/api/v1/users/students/bulk/status` | ✅ | ADMIN, TEACHER | Bulk status update |
| `POST` | `/api/v1/users/students/:id/reset-password` | ✅ | ADMIN | Reset student password |
| `GET` | `/api/v1/users/students/stats` | ✅ | Any | Student statistics dashboard |

---

## Frontend Integration Notes

### Filter Workflow

1. **Page load** — Fetch programs via `GET /api/v1/programs` to populate Program dropdown.
2. **Program selected** — Fetch batches for that program via `GET /api/v1/batches?programId={id}` to populate Batch dropdown.
3. **Filter/Search applied** — Call `GET /api/v1/users/students` with selected filters.
4. **Table state** — Page, sort column, sort order and all active filters should be included in the query string.

### Pagination

- Use `pagination.page`, `pagination.totalPages`, and `pagination.total` to render pagination controls.
- `page` and `limit` are 1-indexed.

### Profile Image

- `personalInfo.profileImage` is either a full URL (Minio endpoint) or `null` (no image uploaded).
- When `null`, show a default avatar placeholder.

### Status Styling

| Status | Suggested Color |
|--------|----------------|
| `ACTIVE` | Green |
| `INACTIVE` | Orange |
| `SUSPENDED` | Red |
| `DELETED` | Gray |

### Frontend Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Students Table                            │
│                                                              │
│  Each row has a ⋮ menu with actions:                         │
│                                                              │
│  • View Profile  ───→  GET /students/:id  ───→  Right Drawer │
│  • Edit Student  ───→  GET then PATCH      ───→  Edit Dialog │
│  • Reset Password ───→ POST /:id/reset-password              │
│  • Deactivate    ───→ PATCH /:id/status { INACTIVE }        │
│  • Delete Student ───→ DELETE /:id         ───→  Confirm     │
│                                                              │
│  Bulk Action Bar (when rows selected):                       │
│  • Activate      ───→ PATCH /bulk/status { ACTIVE }         │
│  • Deactivate    ───→ PATCH /bulk/status { INACTIVE }       │
└──────────────────────────────────────────────────────────────┘
```
