import { Driver } from '../types/driver';
import { DriverInputDto } from '../dto/driver.input-dto';
import { driverCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { DriverQueryDto } from '../routes/handlers/get-driver-list.handler';

export const driversRepository = {
  async findAll(
    queryDto: DriverQueryDto,
  ): Promise<{ items: WithId<Driver>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchDriverNameTerm,
      searchDriverEmailTerm,
      searchVehicleMakeTerm,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter = {
      $or: [
        { name: { $regex: searchDriverNameTerm ?? '', $options: 'i' } },
        { email: { $regex: searchDriverEmailTerm ?? '', $options: 'i' } },
      ],
      ...(searchVehicleMakeTerm
        ? { 'vehicle.make': { $regex: searchVehicleMakeTerm, $options: 'i' } }
        : {}),
    };

    const items = await driverCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await driverCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<Driver> | null> {
    return driverCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newDriver: Driver): Promise<string> {
    const insertResult = await driverCollection.insertOne(newDriver);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: DriverInputDto): Promise<void> {
    const updateResult = await driverCollection.updateOne(
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

    if (updateResult.matchedCount < 1) {
      throw new Error('Driver not exist');
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await driverCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Driver not exist');
    }

    return;
  },
};
