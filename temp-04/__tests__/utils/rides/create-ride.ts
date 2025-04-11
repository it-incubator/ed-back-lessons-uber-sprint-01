// @ts-ignore
import request from 'supertest';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { Express } from 'express';
import { RideAttributes } from '../../../src/rides/application/dtos/ride-attributes';
import { createDriver } from '../drivers/create-driver';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { RIDES_PATH } from '../../../src/core/paths/paths';
import { getRideDto } from './get-ride-dto';
import { RideDataOutput } from '../../../src/rides/routes/output/ride-data.output';

export async function createRide(
  app: Express,
  rideDto?: RideAttributes,
): Promise<RideDataOutput> {
  const driver = await createDriver(app);

  const defaultRideData = getRideDto(driver.id);

  const testRideData = { ...defaultRideData, ...rideDto };

  const createdRideResponse = await request(app)
    .post(RIDES_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testRideData)
    .expect(HttpStatus.Created);

  return createdRideResponse.body;
}
