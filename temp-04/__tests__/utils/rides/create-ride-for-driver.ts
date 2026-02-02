// @ts-ignore
import request from 'supertest';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { Express } from 'express';
import { RideAttributes } from '../../../src/rides/application/dtos/ride-attributes';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { RIDES_PATH } from '../../../src/core/paths/paths';
import { getRideDto } from './get-ride-dto';
import { ResourceType } from '../../../src/core/types/resource-type';
import { RideOutput } from '../../../src/rides/routes/output/ride.output';

export async function createRideForDriver(
  app: Express,
  driverId: string,
  rideDto?: Partial<RideAttributes>,
): Promise<RideOutput> {
  const defaultRideData = getRideDto(driverId);

  const testRideData = {
    data: {
      type: ResourceType.Rides,
      attributes: { ...defaultRideData, ...rideDto },
    },
  };

  const createdRideResponse = await request(app)
    .post(RIDES_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testRideData)
    .expect(HttpStatus.Created);

  return createdRideResponse.body;
}
