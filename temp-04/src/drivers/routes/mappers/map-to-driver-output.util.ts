import { WithId } from 'mongodb';
import { Driver } from '../../types/driver';
import { DriverOutput } from '../../types/driver-output';

export function mapToDriverOutput(driver: WithId<Driver>): DriverOutput {
  return {
    id: driver._id.toString(),
    name: driver.name,
    phoneNumber: driver.phoneNumber,
    email: driver.email,
    vehicle: driver.vehicle,
    createdAt: driver.createdAt,
  };
}
