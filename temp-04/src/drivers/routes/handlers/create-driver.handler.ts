import { Request, Response } from 'express';
import { DriverInputDto } from '../../dto/driver.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToDriverViewModel } from '../mappers/map-to-driver-view-model.util';
import { driversService } from '../../application/drivers.service';

export async function createDriverHandler(
  req: Request<{}, {}, DriverInputDto>,
  res: Response,
) {
  try {
    const createdDriverId = await driversService.create(req.body);

    const createdDriver = await driversService.findById(createdDriverId);

    const driverViewModel = mapToDriverViewModel(createdDriver!);

    res.status(HttpStatus.Created).send(driverViewModel);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
