import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { RideQueryInput } from '../../../rides/routes/input/ride-query.input';
import { ridesService } from '../../../rides/application/rides.service';
import { mapToRideListPaginatedOutput } from '../../../rides/routes/mappers/map-to-ride-list-paginated-output.util';

export async function getDriverRideListHandler(req: Request, res: Response) {
  try {
    const driverId = req.params.id;
    // Используем req.sanitized.query вместо req.query
    // Там значения уже санитизированы через matchedData():
    // - pageNumber и pageSize — числа (благодаря .toInt())
    // - применены .default() значения
    const queryInput = req.sanitized?.query as RideQueryInput;

    const { items, totalCount } = await ridesService.getRidesByDriver(
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
    errorsHandler(e, res, req);
  }
}
