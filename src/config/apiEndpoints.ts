import type { Method } from "axios";

const apiEndpoints = {
    AUTH: {
        LOGIN: {
            url: '/auth/login',
            method: 'POST'
        },
        ME: {
            url: "/auth/me",
            method: "GET"
        },
        LOGOUT: {
            url: "/auth/logout",
            method: "POST"
        },
    },

    USERS: {
        ADD_TEACHER: {
            url: "/users/teachers",
            method: 'POST'
        },
        ADD_STUDENT: {
            url: "/users/students",
            method: 'POST'
        },
        LIST_STUDENTS: {
            url: "/users/students",
            method: 'GET'
        },
        GET_STUDENT: (id: string) => ({
            url: `/users/students/${id}`,
            method: 'GET' as Method,
        }),
        UPDATE_STUDENT: (id: string) => ({
            url: `/users/students/${id}`,
            method: 'PATCH' as Method,
        }),
        DELETE_STUDENT: (id: string) => ({
            url: `/users/students/${id}`,
            method: 'DELETE' as Method,
        }),
        UPDATE_STUDENT_STATUS: (id: string) => ({
            url: `/users/students/${id}/status`,
            method: 'PATCH' as Method,
        }),
        BULK_UPDATE_STATUS: {
            url: "/users/students/bulk/status",
            method: 'PATCH' as Method,
        },
        STUDENTS_STATS: {
            url: "/users/students/stats",
            method: 'GET'
        },
        LIST_TEACHERS: {
            url: "/users/teachers",
            method: 'GET'
        },
        UPLOAD_AVATAR: {
            url: "/uploads/avatar",
            method: 'POST'
        },
        SUMMARY_TEACHERS: {
            url: "/users/teachers/summary",
            method: 'GET'
        }

    },

    LIVE_CLASSES: {
        UPCOMING: {
            url: "/live-classes",
            method: "GET" as Method,
            params: { status: "SCHEDULED" }
        },
        ACTIVE: {
            url: "/live-classes",
            method: "GET" as Method,
            params: { status: "LIVE" }
        },
        COMPLETED: {
            url: "/live-classes",
            method: "GET" as Method,
            params: { status: "ENDED" }
        },
        GET_BY_ROOM_NAME: (roomName: string) => ({
            url: `/live-classes/roomName/${roomName}`,
            method: "GET" as Method,
        }),
        GET_BY_ID: (id: string) => ({
            url: `/live-classes/${id}`,
            method: "GET"
        }),
        CREATE: {
            url: "/live-classes",
            method: "POST"
        },
        START: (id: string) => ({
            url: `/live-classes/${id}/start`,
            method: "POST"
        }),
        JOIN: (roomName: string) => ({
            url: `/live-classes/${roomName}/join`,
            method: "POST"
        }),
        END: (id: string) => ({
            url: `/live-classes/${id}/end`,
            method: "POST"
        }),
        SUBJECTS_SUMMARY: {
            url: "/classes/subjects/summary",
            method: "GET",
        },
        START_LIVE_CLASS: {
            url: "/live-classes",
            method: "POST"
        }
    },

    CLASSES: {
        ADD_CLASS: {
            url: "/classes",
            method: 'POST'
        },
        LIST_CLASSES: {
            url: "/classes",
            method: 'GET'
        },
        GET_CLASS: {
            url: "/classes/:id",
            method: 'GET'
        },
        DELETE_CLASS: {
            url: "/classes/:id",
            method: 'DELETE'
        },
        UPDATE_CLASS: {
            url: "/classes/:id",
            method: 'PATCH'
        },
        ADD_SECTION: {
            url: "/classes/:id/sections",
            method: 'POST'
        },
        UPDATE_SECTION: {
            url: "/classes/:id/sections/:sectionId",
            method: 'PATCH'
        },
        DELETE_SECTION: {
            url: "/classes/:id/sections/:sectionId",
            method: 'DELETE'
        },
    },
    GRADES: {
        CREATE_GRADE: {
            url: "/grades",
            method: 'POST'
        },
        LIST_GRADES: {
            url: "/grades",
            method: 'GET'
        },
        UPDATE_GRADE: {
            url: "/grades/:id",
            method: "PATCH"
        },
        DELETE_GRADE: {
            url: "/grades/:id",
            method: "DELETE"
        }
    },
    SUBJECTS: {
        LIST: {
            url: "/subjects",
            method: "GET" as Method
        },
        GET: {
            url: "/subjects/:id",
            method: "GET" as Method
        },
        CREATE: {
            url: "/subjects",
            method: "POST" as Method
        },
        UPDATE: {
            url: "/subjects/:id",
            method: "PATCH" as Method
        },
        DELETE: {
            url: "/subjects/:id",
            method: "DELETE" as Method
        }
    },
    BATCHES: {
        LIST: {
            url: "/batches",
            method: "GET" as Method
        },
        GET: {
            url: "/batches/:id",
            method: "GET" as Method
        },
        CREATE: {
            url: "/batches",
            method: "POST" as Method
        },
        UPDATE: {
            url: "/batches/:id",
            method: "PATCH" as Method
        },
        DELETE: {
            url: "/batches/:id",
            method: "DELETE" as Method
        }
    },
    PROGRAMS: {
        LIST: {
            url: "/programs",
            method: "GET" as Method
        },
        GET: {
            url: "/programs/:id",
            method: "GET" as Method
        },
        CREATE: {
            url: "/programs",
            method: "POST" as Method
        },
        UPDATE: {
            url: "/programs/:id",
            method: "PATCH" as Method
        },
        DELETE: {
            url: "/programs/:id",
            method: "DELETE" as Method
        }
    },
    MATERIALS: {
        LIST: {
            url: "/materials",
            method: "GET" as Method
        },
        GET: (id: string) => ({
            url: `/materials/${id}`,
            method: "GET" as Method,
        }),
        UPDATE: (id: string) => ({
            url: `/materials/${id}`,
            method: "PATCH" as Method,
        }),
        PUBLISH: (id: string) => ({
            url: `/materials/${id}/publish`,
            method: "POST" as Method,
        }),
        DELETE: (id: string) => ({
            url: `/materials/${id}`,
            method: "DELETE" as Method,
        }),
        RESTORE: (id: string) => ({
            url: `/materials/${id}/restore`,
            method: "POST" as Method,
        }),
        STATS: {
            url: "/materials/stats",
            method: "GET" as Method
        },
        METADATA: {
            url: "/materials/metadata",
            method: "POST" as Method
        }
    },
    UPLOADS: {
        CREATE_MULTIPART_UPLOAD: {
            url: "/uploads/materials/s3/multipart/create",
            method: "POST"
        },
        SIGN_MULTIPART_UPLOAD: {
            url: "/uploads/materials/s3/multipart/sign-part",
            method: "POST"
        },
        COMPLETE_MULTIPART_UPLOAD: {
            url: "/uploads/materials/s3/multipart/complete",
            method: "POST"
        },
        ABORT_MULTIPART_UPLOAD: {
            url: "/uploads/materials/s3/multipart/abort",
            method: "POST"
        },
        LIST_MULTIPART_UPLOADS: {
            url: "/uploads/materials/s3/multipart/list-parts",
            method: "POST"
        }
    },
    ASSESSMENTS: {
        GENERATE: {
            url: "/assessments/generate",
            method: "POST"
        }
    }
}

export default apiEndpoints;