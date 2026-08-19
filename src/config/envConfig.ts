const envConfig = {
    baseURL: import.meta.env.VITE_BASE_URL,
    minioStotageBaseURL: import.meta.env.VITE_MINIO_STORAGE_URL,
    minioBucketName: import.meta.env.VITE_MINIO_BUCKET_NAME,
    websocketURL: import.meta.env.VITE_WEBSOCKET_URL,
}


export default envConfig;