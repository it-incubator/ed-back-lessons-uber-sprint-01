import { Request, Response, NextFunction } from 'express';
import { driversService } from '../../application/drivers.service';
import { mapToDriverListPaginatedOutput } from '../mappers/map-to-driver-list-paginated-output.util';
import { DriverQueryInput } from '../input/driver-query.input';

export async function getDriverListHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Используем req.sanitized.query вместо req.query
    // Там значения уже санитизированы через matchedData():
    // - pageNumber и pageSize — числа (благодаря .toInt())
    // - применены .default() значения
    const queryInput = req.sanitized?.query as DriverQueryInput;

    const { items, totalCount } = await driversService.findMany(queryInput);

    const driversListOutput = mapToDriverListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.send(driversListOutput);
  } catch (e: unknown) {
    next(e);
  }
}
