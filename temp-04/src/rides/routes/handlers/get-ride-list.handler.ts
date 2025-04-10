import { Request, Response } from 'express';
import { ridesService } from '../../application/rides.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToRideListPaginatedOutput } from '../mappers/map-to-ride-list-paginated-output.util';
import { RideQueryInput } from '../../input/ride-query.input';

export async function getRideListHandler(
  req: Request<{}, {}, {}, RideQueryInput>,
  res: Response,
) {
  try {
    const queryInput = req.query;

    const { items, totalCount } = await ridesService.findMany(queryInput);

    const rideListOutput = mapToRideListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.send(rideListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
