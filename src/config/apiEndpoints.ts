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
        GET_BY_ROOM_NAME: (roomName: string) => ({
            url: `/live-classes/room/${roomName}`,
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
        JOIN: (id: string) => ({
            url: `/live-classes/${id}/join`,
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
        START_LIVE_CLASS :{
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

}

export default apiEndpoints;