import { Request, Response } from 'express';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToDriverListPaginatedOutput } from '../mappers/map-to-driver-list-paginated-output.util';
import { DriverQueryInput } from '../input/driver-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';

export async function getDriverListHandler(req: Request, res: Response) {
  try {
    // express-validator с .toInt() уже преобразовал строки в числа,
    // но TypeScript не знает об этом runtime-преобразовании
    const queryInput = setDefaultSortAndPaginationIfNotExist(
      req.query as unknown as DriverQueryInput,
    );

    const { items, totalCount } = await driversService.findMany(queryInput);

    const driversListOutput = mapToDriverListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.send(driversListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res, req);
  }
}
