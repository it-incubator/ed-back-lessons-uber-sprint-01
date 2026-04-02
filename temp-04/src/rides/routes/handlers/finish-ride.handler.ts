import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { ridesService } from '../../application/rides.service';

export async function finishRideHandler(
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;

    await ridesService.finishRide(id);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    next(e);
  }
}
