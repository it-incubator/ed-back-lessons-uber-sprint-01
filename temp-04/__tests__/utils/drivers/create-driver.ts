// @ts-ignore
import request from 'supertest';
import { DriverInput } from '../../../src/drivers/routes/input/driver.input';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { getDriverDto } from './get-driver-dto';
import { DriverOutput } from '../../../src/drivers/routes/output/driver.output';

export async function createDriver(
  app: Express,
  driverDto?: DriverInput,
): Promise<DriverOutput> {
  const defaultDriverData: DriverInput = getDriverDto();

  const testDriverData = { ...defaultDriverData, ...driverDto };

  const createdDriverResponse = await request(app)
    .post(DRIVERS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.Created);

  return createdDriverResponse.body;
}
