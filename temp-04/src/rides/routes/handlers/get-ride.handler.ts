import { Request, Response, NextFunction } from 'express';
import { mapToRideOutputUtil } from '../mappers/map-to-ride-output.util';
import { ridesService } from '../../application/rides.service';

export async function getRideHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;

    const ride = await ridesService.findByIdOrFail(id);

    const rideOutput = mapToRideOutputUtil(ride);

    res.send(rideOutput);
  } catch (e: unknown) {
    next(e);
  }
}
