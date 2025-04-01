import { driversRepository } from '../repositories/drivers.repository';
import { WithId } from 'mongodb';
import { Driver } from '../types/driver';
import { DriverInputDto } from '../dto/driver.input-dto';
import { DriverQueryDto } from '../routes/handlers/get-driver-list.handler';

export const driversService = {
  async findAll(
    queryDto: DriverQueryDto,
  ): Promise<{ items: WithId<Driver>[]; totalCount: number }> {
    return driversRepository.findAll(queryDto);
  },

  async findById(id: string): Promise<WithId<Driver> | null> {
    return driversRepository.findById(id);
  },

  async create(dto: DriverInputDto): Promise<string> {
    const newDriver: Driver = {
      name: dto.name,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      vehicle: {
        make: dto.vehicleMake,
        model: dto.vehicleModel,
        year: dto.vehicleYear,
        licensePlate: dto.vehicleLicensePlate,
        description: dto.vehicleDescription,
        features: dto.vehicleFeatures,
      },
      createdAt: new Date(),
    };

    return driversRepository.create(newDriver);
  },

  async update(id: string, dto: DriverInputDto): Promise<boolean> {
    const driver = driversRepository.findById(id);

    if (!driver) {
      return false;
    }

    await driversRepository.update(id, dto);
    return true;
  },

  async delete(id: number) {},
};
