import { Request, Response } from 'express';
import { driversRepository } from '../../repositories/drivers.repository';

export function getDriverListHandler(req: Request, res: Response) {
  const drivers = driversRepository.getAll();
  res.send(drivers);
}
