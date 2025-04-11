import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { RideQueryInput } from '../../../rides/input/ride-query.input';
import { ridesService } from '../../../rides/application/rides.service';
import { mapToRideListPaginatedOutput } from '../../../rides/routes/mappers/map-to-ride-list-paginated-output.util';
import { driversService } from '../../application/drivers.service';

export async function getDriverRideListHandler(
  req: Request<{ id: string }, {}, {}, RideQueryInput>,
  res: Response,
) {
  try {
    const driverId = req.params.id;

    await driversService.findByIdOrFail(driverId);

    const queryInput = req.query;

    const { items, totalCount } = await ridesService.findMany(
      queryInput,
      driverId,
    );

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
