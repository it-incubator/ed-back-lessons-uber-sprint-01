import { Request, Response } from 'express';
import { mapToDriverViewModel } from '../mappers/map-to-driver-view-model.util';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversService } from '../../application/drivers.service';

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

type PaginationAndSorting = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
};

export type DriverQueryDto = PaginationAndSorting & {
  searchDriverNameTerm?: string;
  searchDriverEmailTerm?: string;
  searchVehicleMakeTerm?: string;
};

export enum DriverSortField {
  CreatedAt = 'createdAt',
  Name = 'name',
  Email = 'email',
}

export async function getDriverListHandler(
  req: Request<{}, {}, {}, DriverQueryDto>,
  res: Response,
) {
  try {
    const queryDto = req.query;

    const { items, totalCount } = await driversService.findAll(queryDto);

    const driverViewModels = items.map(mapToDriverViewModel);

    const result = {
      page: queryDto.pageNumber,
      pageSize: queryDto.pageSize,
      pageCount: Math.ceil(totalCount / queryDto.pageSize),
      totalCount,
      items: driverViewModels,
    };

    res.send(result);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
