import { appConfig } from '../../src/core/configs/app.config';

export function generateBasicAuthToken() {
  const credentials = `${appConfig.ADMIN_USERNAME}:${appConfig.ADMIN_PASSWORD}`;
  const token = Buffer.from(credentials).toString('base64');
  return `Basic ${token}`;
}
