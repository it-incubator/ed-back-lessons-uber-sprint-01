import { DriverDataOutput } from './driver-data.output';
import { PaginatedOutput } from '../routes/handlers/get-driver-list.handler';

export type DriverListPaginatedOutput = {
  meta: PaginatedOutput;
  data: DriverDataOutput[];
};
