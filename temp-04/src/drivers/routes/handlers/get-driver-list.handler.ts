import { Request, Response } from 'express';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToDriverListPaginatedOutput } from '../mappers/map-to-driver-list-paginated-output.util';

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

type PaginationAndSorting<S> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S;
  sortDirection: SortDirection;
};

export type DriverQueryInput = PaginationAndSorting<DriverSortField> &
  Partial<{
    searchDriverNameTerm: string;
    searchDriverEmailTerm: string;
    searchVehicleMakeTerm: string;
  }>;

export enum DriverSortField {
  CreatedAt = 'createdAt',
  Name = 'name',
  Email = 'email',
}

export type PaginatedOutput = {
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
};

export async function getDriverListHandler(
  req: Request<{}, {}, {}, DriverQueryInput>,
  res: Response,
) {
  try {
    const queryInput = req.query;

    const { items, totalCount } = await driversService.findAll(queryInput);

    const result = mapToDriverListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.send(result);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
