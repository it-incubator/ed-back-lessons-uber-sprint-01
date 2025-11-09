import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToSkillMatrixOutput } from '../mappers/map-to-skill-matrix-output.util';
import { skillMatricesService } from '../../application/skill-matrices.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { SkillMatrixCreateInput } from '../input/skill-matrix-create.input';

export async function createSkillMatrixHandler(
  req: Request<{}, {}, SkillMatrixCreateInput>,
  res: Response,
) {
  try {
    const createdSkillMatrixId = await skillMatricesService.create(
      req.body.data.attributes,
    );

    const createdSkillMatrix =
      await skillMatricesService.findByIdOrFail(createdSkillMatrixId);

    const skillMatrixOutput = mapToSkillMatrixOutput(createdSkillMatrix);

    res.status(HttpStatus.Created).send(skillMatrixOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
