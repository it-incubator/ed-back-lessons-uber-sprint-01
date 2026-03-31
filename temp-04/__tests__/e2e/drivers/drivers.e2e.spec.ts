// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';

import { VehicleFeature } from '../../../src/drivers/domain/driver';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';

import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { createDriver } from '../../utils/drivers/create-driver';
import { getDriverDto } from '../../utils/drivers/get-driver-dto';
import { clearDb } from '../../utils/clear-db';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';
import { updateDriver } from '../../utils/drivers/update-driver';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { DriverAttributes } from '../../../src/drivers/application/dtos/driver-attributes';

describe('Driver API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB('mongodb://localhost:27017/ed-back-lessons-uber-test');
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('✅ should create driver; POST /api/drivers', async () => {
    await createDriver(app, {
      ...getDriverDto(),
      name: 'Feodor',
      email: 'feodor@example.com',
    });
  });

  it('✅ should return drivers list; GET /api/drivers', async () => {
    await Promise.all([createDriver(app), createDriver(app)]);

    const response = await request(app)
      .get(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should return driver by id; GET /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);
    const createdDriverId = createdDriver.data.id;

    const driver = await getDriverById(app, createdDriverId);

    expect(driver).toEqual({
      ...createdDriver,
    });
  });

  it('✅ should update driver; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);
    const createdDriverId = createdDriver.data.id;

    const driverUpdateData: DriverAttributes = {
      name: 'Updated Name',
      phoneNumber: '999-888-7777',
      email: 'updated@example.com',
      vehicleMake: 'Tesla',
      vehicleModel: 'Model S',
      vehicleYear: 2022,
      vehicleLicensePlate: 'NEW-789',
      vehicleDescription: 'Updated vehicle description',
      vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    await updateDriver(app, createdDriverId, driverUpdateData);

    const driverResponse = await getDriverById(app, createdDriverId);

    expect(driverResponse.data.id).toBe(createdDriverId);
    expect(driverResponse.data.attributes).toEqual({
      name: driverUpdateData.name,
      phoneNumber: driverUpdateData.phoneNumber,
      email: driverUpdateData.email,
      vehicle: {
        description: driverUpdateData.vehicleDescription,
        features: driverUpdateData.vehicleFeatures,
        licensePlate: driverUpdateData.vehicleLicensePlate,
        make: driverUpdateData.vehicleMake,
        model: driverUpdateData.vehicleModel,
        year: driverUpdateData.vehicleYear,
      },
      createdAt: expect.any(String),
    });
  });

  it('✅ should delete driver and check after "NOT FOUND"; DELETE /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);
    const createdDriverId = createdDriver.data.id;

    await request(app)
      .delete(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
  });

  it('✅ should return paginated drivers list; GET /api/drivers?pageNumber&pageSize', async () => {
    await clearDb(app);
    // Create 5 drivers
    for (let i = 0; i < 5; i++) {
      await createDriver(app, {
        ...getDriverDto(),
        name: `Driver ${i}`,
        email: `driver${i}@example.com`,
      });
    }

    // Request page 1 with size 2
    const page1Response = await request(app)
      .get(DRIVERS_PATH)
      .query({ pageNumber: 1, pageSize: 2 })
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(page1Response.body.data).toHaveLength(2);
    expect(page1Response.body.meta.totalCount).toBe(5);
    expect(page1Response.body.meta.pageCount).toBe(3);
    expect(page1Response.body.meta.page).toBe(1);
    expect(page1Response.body.meta.pageSize).toBe(2);

    // Request page 2
    const page2Response = await request(app)
      .get(DRIVERS_PATH)
      .query({ pageNumber: 2, pageSize: 2 })
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(page2Response.body.data).toHaveLength(2);
    expect(page2Response.body.meta.page).toBe(2);

    // Request page 3 (last page with 1 item)
    const page3Response = await request(app)
      .get(DRIVERS_PATH)
      .query({ pageNumber: 3, pageSize: 2 })
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(page3Response.body.data).toHaveLength(1);
  });

  it('✅ should return sorted drivers list; GET /api/drivers?sortBy&sortDirection', async () => {
    await clearDb(app);
    await createDriver(app, {
      ...getDriverDto(),
      name: 'Zach',
      email: 'zach@example.com',
    });
    await createDriver(app, {
      ...getDriverDto(),
      name: 'Anna',
      email: 'anna@example.com',
    });
    await createDriver(app, {
      ...getDriverDto(),
      name: 'Mike',
      email: 'mike@example.com',
    });

    // Sort by name ascending
    const ascResponse = await request(app)
      .get(DRIVERS_PATH)
      .query({ sortBy: 'name', sortDirection: 'asc' })
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(ascResponse.body.data[0].attributes.name).toBe('Anna');
    expect(ascResponse.body.data[1].attributes.name).toBe('Mike');
    expect(ascResponse.body.data[2].attributes.name).toBe('Zach');

    // Sort by name descending
    const descResponse = await request(app)
      .get(DRIVERS_PATH)
      .query({ sortBy: 'name', sortDirection: 'desc' })
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(descResponse.body.data[0].attributes.name).toBe('Zach');
    expect(descResponse.body.data[1].attributes.name).toBe('Mike');
    expect(descResponse.body.data[2].attributes.name).toBe('Anna');
  });
});
