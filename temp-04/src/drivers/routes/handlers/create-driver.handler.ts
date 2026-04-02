import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToDriverOutput } from '../mappers/map-to-driver-output.util';
import { driversService } from '../../application/drivers.service';
import { DriverCreateInput } from '../input/driver-create.input';

export async function createDriverHandler(
  req: Request<{}, {}, DriverCreateInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const createdDriverId = await driversService.create(
      req.body.data.attributes,
    );

    const createdDriver = await driversService.findByIdOrFail(createdDriverId);

    const driverOutput = mapToDriverOutput(createdDriver);

    res.status(HttpStatus.Created).send(driverOutput);
  } catch (e: unknown) {
    next(e);
  }
}
