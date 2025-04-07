import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function deleteDriverHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;

    await driversRepository.delete(id);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
