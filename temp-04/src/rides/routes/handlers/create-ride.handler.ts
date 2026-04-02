import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToRideOutputUtil } from '../mappers/map-to-ride-output.util';
import { RideCreateInput } from '../input/ride-create.input';
import { ridesService } from '../../application/rides.service';

export async function createRideHandler(
  req: Request<{}, {}, RideCreateInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const createdRideId = await ridesService.create(req.body.data.attributes);

    const createdRide = await ridesService.getById(createdRideId);

    const rideOutput = mapToRideOutputUtil(createdRide);

    res.status(HttpStatus.Created).send(rideOutput);
  } catch (e: unknown) {
    next(e);
  }
}
