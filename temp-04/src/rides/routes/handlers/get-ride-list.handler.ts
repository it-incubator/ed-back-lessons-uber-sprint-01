import { Request, Response, NextFunction } from 'express';
import { ridesService } from '../../application/rides.service';
import { mapToRideListPaginatedOutput } from '../mappers/map-to-ride-list-paginated-output.util';
import { RideQueryInput } from '../input/ride-query.input';

export async function getRideListHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Используем req.sanitized.query вместо req.query
    // Там значения уже санитизированы через matchedData():
    // - pageNumber и pageSize — числа (благодаря .toInt())
    // - применены .default() значения
    const queryInput = req.sanitized?.query as RideQueryInput;

    const { items, totalCount } = await ridesService.getMany(queryInput);

    const rideListOutput = mapToRideListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });
    res.send(rideListOutput);
  } catch (e: unknown) {
    next(e);
  }
}
