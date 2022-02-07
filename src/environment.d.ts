declare global {
    namespace NodeJS {
        interface ProcessEnv {
            QUEUE_URL: string;
            TABLE_NAME: string;
        }
    }
}

export {}