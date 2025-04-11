// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { DriverInput } from '../../../src/drivers/routes/input/driver.input';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { getDriverDto } from './get-driver-dto';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';

export async function updateDriver(
  app: Express,
  driverId: string,
  driverDto?: DriverInput,
): Promise<void> {
  const defaultDriverData: DriverInput = getDriverDto();

  const testDriverData = { ...defaultDriverData, ...driverDto };

  const updatedDriverResponse = await request(app)
    .put(`${DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.NoContent);

  return updatedDriverResponse.body;
}
