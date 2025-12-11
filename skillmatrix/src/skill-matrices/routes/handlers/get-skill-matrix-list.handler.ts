import { Request, Response } from 'express';
import { skillMatricesService } from '../../application/skill-matrices.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToSkillMatrixListPaginatedOutput } from '../mappers/map-to-skill-matrix-list-paginated-output.util';
import { SkillMatrixQueryInput } from '../input/skill-matrix-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';

export async function getSkillMatrixListHandler(
  req: Request<{}, {}, {}, SkillMatrixQueryInput>,
  res: Response,
) {
  try {
    const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const { items, totalCount } =
      await skillMatricesService.findMany(queryInput);

    const skillMatricesListOutput = mapToSkillMatrixListPaginatedOutput(
      items,
      {
        pageNumber: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount,
      },
    );

    res.send(skillMatricesListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
