import { Request, Response } from 'express';
import { mapToDriverOutput } from '../mappers/map-to-driver-output.util';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { formatJsonApiResponse } from '../../../core/mappers/response.mapper';
import { DriverOutput } from '../../types/driver-output';

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

export type ListPaginatedOutput<I> = {
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  items: I;
};

export async function getDriverListHandler(
  req: Request<{}, {}, {}, DriverQueryInput>,
  res: Response,
) {
  try {
    const queryInput = req.query;

    const { items, totalCount } = await driversService.findAll(queryInput);

    // const driverListOutput = items.map(mapToDriverOutput);

    const result = formatJsonApiResponse<DriverOutput>({
      entities: items,
      entityType: 'drivers',
      meta: {
        page: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        pageCount: Math.ceil(totalCount / queryInput.pageSize),
        totalCount,
      },
      attributeMapper: mapToDriverOutput,
    });

    res.send(result);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
