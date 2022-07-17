declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      TOKEN_SECRET: string;
    }
  }
}

export {};
