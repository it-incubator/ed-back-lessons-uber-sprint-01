import { Request, Response } from 'express';
import { ridesService } from '../../application/rides.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToRideListPaginatedOutput } from '../mappers/map-to-ride-list-paginated-output.util';
import { RideQueryInput } from '../input/ride-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';

export async function getRideListHandler(req: Request, res: Response) {
  try {
    // express-validator с .toInt() уже преобразовал строки в числа,
    // но TypeScript не знает об этом runtime-преобразовании
    const queryInput = setDefaultSortAndPaginationIfNotExist(
      req.query as unknown as RideQueryInput,
    );

    const { items, totalCount } = await ridesService.findMany(queryInput);

    const rideListOutput = mapToRideListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.send(rideListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res, req);
  }
}
