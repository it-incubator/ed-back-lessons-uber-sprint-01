import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { skillMatricesService } from '../../application/skill-matrices.service';
import { SkillMatrixUpdateInput } from '../input/skill-matrix-update.input';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function updateSkillMatrixHandler(
  req: Request<{ id: string }, {}, SkillMatrixUpdateInput>,
  res: Response,
) {
  try {
    const id = req.params.id;

    await skillMatricesService.update(id, req.body.data.attributes);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
