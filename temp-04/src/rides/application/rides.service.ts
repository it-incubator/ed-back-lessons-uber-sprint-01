import { RideAttributes } from './dtos/ride-attributes';
import { driversRepository } from '../../drivers/repositories/drivers.repository';
import { ridesRepository } from '../repositories/rides.repository';
import { DomainError } from '../../core/errors/domain.error';
import { DriverErrorCode } from '../../drivers/application/drivers.service';
import { Ride } from '../domain/ride';
import { WithId } from 'mongodb';
import { RideQueryInput } from '../routes/input/ride-query.input';

export enum RideErrorCode {
  AlreadyFinished = 'RIDE_ALREADY_FINISHED',
}

export const ridesService = {
  async getMany(
    queryDto: RideQueryInput,
  ): Promise<{ items: WithId<Ride>[]; totalCount: number }> {
    return ridesRepository.getMany(queryDto);
  },

  async getRidesByDriver(
    queryDto: RideQueryInput,
    driverId: string,
  ): Promise<{ items: WithId<Ride>[]; totalCount: number }> {
    await driversRepository.getById(driverId);

    return ridesRepository.getRidesByDriver(queryDto, driverId);
  },

  async getById(id: string): Promise<WithId<Ride>> {
    return ridesRepository.getById(id);
  },

  async create(dto: RideAttributes): Promise<string> {
    const driver = await driversRepository.getById(dto.driverId);

    // Если у водителя сейчас есть заказ, то создать новую поездку нельзя
    const activeRide = await ridesRepository.getActiveRideByDriverIdOrDefault(
      dto.driverId,
    );

    if (activeRide) {
      throw new DomainError(
        `Driver has an active ride. Complete or cancel the ride first`,
        DriverErrorCode.HasActiveRide,
      );
    }

    const newRide: Ride = {
      clientName: dto.clientName,
      driver: {
        id: dto.driverId,
        name: driver.name,
      },
      vehicle: {
        licensePlate: driver.vehicle.licensePlate,
        name: `${driver.vehicle.make} ${driver.vehicle.model}`,
      },
      price: dto.price,
      currency: dto.currency,
      createdAt: new Date(),
      updatedAt: new Date(),
      startedAt: new Date(),
      finishedAt: null,
      addresses: {
        from: dto.fromAddress,
        to: dto.toAddress,
      },
    };

    return await ridesRepository.createRide(newRide);
  },

  async finishRide(id: string) {
    const ride = await ridesRepository.getById(id);

    if (ride.finishedAt) {
      throw new DomainError(
        `Ride is already finished at ${ride.finishedAt}`,
        RideErrorCode.AlreadyFinished,
      );
    }
    await ridesRepository.finishRide(id, new Date());
  },
};
