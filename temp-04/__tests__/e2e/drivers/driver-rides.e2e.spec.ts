// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';

import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { createDriver } from '../../utils/drivers/create-driver';
import { getDriverDto } from '../../utils/drivers/get-driver-dto';
import { clearDb } from '../../utils/clear-db';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { createRideForDriver } from '../../utils/rides/create-ride-for-driver';

describe('Driver Rides API', () => {
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

  it('✅ should return rides for specific driver; GET /api/drivers/:id/rides', async () => {
    // Create two drivers
    const driver1 = await createDriver(app, {
      ...getDriverDto(),
      name: 'Driver One',
      email: 'driver1@example.com',
    });
    const driver2 = await createDriver(app, {
      ...getDriverDto(),
      name: 'Driver Two',
      email: 'driver2@example.com',
    });

    // Create 3 rides for driver1 and 2 rides for driver2
    await createRideForDriver(app, driver1.data.id, { clientName: 'Client A' });
    await createRideForDriver(app, driver1.data.id, { clientName: 'Client B' });
    await createRideForDriver(app, driver1.data.id, { clientName: 'Client C' });
    await createRideForDriver(app, driver2.data.id, { clientName: 'Client D' });
    await createRideForDriver(app, driver2.data.id, { clientName: 'Client E' });

    // Get rides for driver1
    const driver1RidesResponse = await request(app)
      .get(`${DRIVERS_PATH}/${driver1.data.id}/rides`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(driver1RidesResponse.body.data).toHaveLength(3);
    expect(driver1RidesResponse.body.meta.totalCount).toBe(3);

    // Get rides for driver2
    const driver2RidesResponse = await request(app)
      .get(`${DRIVERS_PATH}/${driver2.data.id}/rides`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(driver2RidesResponse.body.data).toHaveLength(2);
    expect(driver2RidesResponse.body.meta.totalCount).toBe(2);
  });

  it('✅ should return paginated rides for driver; GET /api/drivers/:id/rides?pageNumber&pageSize', async () => {
    await clearDb(app);

    const driver = await createDriver(app);

    // Create 5 rides for the driver
    for (let i = 0; i < 5; i++) {
      await createRideForDriver(app, driver.data.id, {
        clientName: `Client ${i}`,
      });
    }

    // Get page 1 with size 2
    const page1Response = await request(app)
      .get(`${DRIVERS_PATH}/${driver.data.id}/rides`)
      .query({ pageNumber: 1, pageSize: 2 })
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(page1Response.body.data).toHaveLength(2);
    expect(page1Response.body.meta.totalCount).toBe(5);
    expect(page1Response.body.meta.pageCount).toBe(3);
    expect(page1Response.body.meta.page).toBe(1);
    expect(page1Response.body.meta.pageSize).toBe(2);

    // Get page 2
    const page2Response = await request(app)
      .get(`${DRIVERS_PATH}/${driver.data.id}/rides`)
      .query({ pageNumber: 2, pageSize: 2 })
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(page2Response.body.data).toHaveLength(2);
    expect(page2Response.body.meta.page).toBe(2);
  });

  it('✅ should return empty list for driver with no rides; GET /api/drivers/:id/rides', async () => {
    await clearDb(app);

    const driver = await createDriver(app);

    const response = await request(app)
      .get(`${DRIVERS_PATH}/${driver.data.id}/rides`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(response.body.data).toHaveLength(0);
    expect(response.body.meta.totalCount).toBe(0);
  });

  it('❌ should return 404 for non-existent driver rides; GET /api/drivers/:id/rides', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011';

    await request(app)
      .get(`${DRIVERS_PATH}/${nonExistentId}/rides`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
  });

  it('❌ should return 401 without authorization; GET /api/drivers/:id/rides', async () => {
    const driver = await createDriver(app);

    await request(app)
      .get(`${DRIVERS_PATH}/${driver.data.id}/rides`)
      .expect(HttpStatus.Unauthorized);
  });
});
