# Student Module — Additional API Requirements

Base URL: `/api/v1/users`

All endpoints require **authentication** via JWT token (httpOnly cookie).

---

## 1. Get Single Student

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

**Frontend Usage:**
- Student profile drawer (right-side drawer)
- Pre-fill edit form

---

## 2. Update Student

```
PATCH /api/v1/users/students/:id
```

**Path Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | MongoDB ObjectId of the student |

**Request Body** (all fields optional — only send changed fields):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | No | Valid email address |
| `phoneNumber` | string | No | Indian phone number (10 digits) |
| `personalInfo.name` | string | No | Student's full name (2-100 chars) |
| `personalInfo.dateOfBirth` | string | No | ISO date (YYYY-MM-DD) |
| `personalInfo.gender` | enum | No | `MALE` \| `FEMALE` \| `OTHER` |
| `personalInfo.profileImage` | string | No | URL or storage path |
| `personalInfo.address.line1` | string | No | Address line 1 |
| `personalInfo.address.city` | string | No | City name |
| `personalInfo.address.state` | string | No | State name |
| `personalInfo.address.country` | string | No | Country name |
| `personalInfo.address.zipCode` | string | No | Zip code |
| `roleInfo.rollNumber` | string | No | Roll number |
| `roleInfo.batchId` | string | No | Valid Batch ObjectId |
| `roleInfo.admissionDate` | string | No | ISO date (YYYY-MM-DD) |
| `roleInfo.guardianName` | string | No | Guardian's full name |
| `roleInfo.guardianPhoneNumber` | string | No | Indian phone number (10 digits) |

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

---

## 3. Delete Student

```
DELETE /api/v1/users/students/:id
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
  "message": "Student deleted successfully",
  "data": null
}
```

**Response (404):**

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

## 4. Change Student Status (Activate / Deactivate / Suspend)

```
PATCH /api/v1/users/students/:id/status
```

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
- Deactivate Account action in dropdown → sends `{ "status": "INACTIVE" }`
- Bulk Activate / Deactivate buttons (when multiple students selected) → can be batched or sent one-by-one
- On success, refresh the student list

---

## 5. Bulk Status Update

```
PATCH /api/v1/users/students/bulk/status
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `studentIds` | string[] | **Yes** | Array of student ObjectIds |
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
- Bulk action bar: "Activate" / "Deactivate" buttons when one or more checkboxes are selected
- On success, clear selection and refresh the student list

---

## 6. Reset Student Password

```
POST /api/v1/users/students/:id/reset-password
```

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

## Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/users/students/:id` | Get single student profile |
| `PATCH` | `/api/v1/users/students/:id` | Update student fields |
| `DELETE` | `/api/v1/users/students/:id` | Delete student |
| `PATCH` | `/api/v1/users/students/:id/status` | Change student status |
| `PATCH` | `/api/v1/users/students/bulk/status` | Bulk status update |
| `POST` | `/api/v1/users/students/:id/reset-password` | Reset student password |

---

## Frontend Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Students Table                            │
│                                                              │
│  Each row has a ⋮ menu with actions:                         │
│                                                              │
│  • View Profile  ───→  GET /students/:id  ───→  Right Drawer │
│  • Edit Student  ───→  GET then PATCH      ───→  Edit Dialog │
│  • Reset Password ───→ POST /:id/reset-password              │
│  • Deactivate     ───→ PATCH /:id/status { INACTIVE }       │
│  • Delete Student ───→ DELETE /:id         ───→  Confirm     │
│                                                              │
│  Bulk Action Bar (when rows selected):                       │
│  • Activate       ───→ PATCH /bulk/status { ACTIVE }        │
│  • Deactivate     ───→ PATCH /bulk/status { INACTIVE }      │
└──────────────────────────────────────────────────────────────┘
```
