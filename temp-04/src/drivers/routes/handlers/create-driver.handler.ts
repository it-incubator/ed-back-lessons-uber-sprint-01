import { Request, Response } from 'express';
import { DriverInput } from '../../input/driver.input';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToDriverOutput } from '../mappers/map-to-driver-output.util';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function createDriverHandler(
  req: Request<{}, {}, DriverInput>,
  res: Response,
) {
  try {
    const createdDriverId = await driversService.create(req.body);

    const createdDriver = await driversService.findByIdOrFail(createdDriverId);

    const driverOutput = mapToDriverOutput(createdDriver!);

    res.status(HttpStatus.Created).send(driverOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
