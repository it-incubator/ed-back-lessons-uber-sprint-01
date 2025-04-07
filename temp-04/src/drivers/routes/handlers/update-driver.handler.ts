import { Request, Response } from 'express';
import { DriverInput } from '../../input/driver.input';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
import { driversService } from '../../application/drivers.service';

export async function updateDriverHandler(
  req: Request<{ id: string }, {}, DriverInput>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const isUpdated = await driversService.update(id, req.body);

    if (!isUpdated) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
