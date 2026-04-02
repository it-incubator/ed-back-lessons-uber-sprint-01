import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToDriverOutput } from '../mappers/map-to-driver-output.util';
import { driversService } from '../../application/drivers.service';

export async function getDriverHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;

    const driver = await driversService.getById(id);

    const driverOutput = mapToDriverOutput(driver);

    res.status(HttpStatus.Ok).send(driverOutput);
  } catch (e: unknown) {
    next(e);
  }
}
