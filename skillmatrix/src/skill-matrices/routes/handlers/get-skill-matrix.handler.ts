import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToSkillMatrixOutput } from '../mappers/map-to-skill-matrix-output.util';
import { skillMatricesService } from '../../application/skill-matrices.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getSkillMatrixHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    const skillMatrix = await skillMatricesService.findByIdOrFail(id);

    const skillMatrixOutput = mapToSkillMatrixOutput(skillMatrix);

    res.status(HttpStatus.Ok).send(skillMatrixOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
