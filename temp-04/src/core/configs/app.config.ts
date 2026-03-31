import 'dotenv/config';

function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env variable: ${key}`);
  }
  return value;
}

function getNumberEnvOrThrow(key: string): number {
  const value = getEnvOrThrow(key);
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Env variable ${key} is not a number: ${value}`);
  }
  return num;
}

export const appConfig = {
  PORT: getNumberEnvOrThrow('PORT'),
  MONGO_URL: getEnvOrThrow('MONGO_URL'),
  DB_NAME: getEnvOrThrow('DB_NAME'),
  ADMIN_USERNAME: getEnvOrThrow('ADMIN_USERNAME'),
  ADMIN_PASSWORD: getEnvOrThrow('ADMIN_PASSWORD'),
};
