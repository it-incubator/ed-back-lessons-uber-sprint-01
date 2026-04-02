import { Driver } from '../types/driver';
import { DriverInputDto } from '../dto/driver.input-dto';
import { driverCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

export const driversRepository = {
  async getAll(): Promise<WithId<Driver>[]> {
    return driverCollection.find().toArray();
  },

  async getByIdOrDefault(id: string): Promise<WithId<Driver> | null> {
    return driverCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newDriver: Driver): Promise<WithId<Driver>> {
    const insertResult = await driverCollection.insertOne(newDriver);

    return { ...newDriver, _id: insertResult.insertedId };
  },

  async update(id: string, dto: DriverInputDto): Promise<void> {
    await driverCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
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
        },
      },
    );

    return;
  },

  async delete(id: string): Promise<void> {
    await driverCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return;
  },
};
