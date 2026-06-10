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
       
    },
  
}

export default apiEndpoints;