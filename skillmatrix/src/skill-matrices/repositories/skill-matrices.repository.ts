import { SkillMatrix } from '../domain/skill-matrix';
import { skillMatrixCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { SkillMatrixAttributes } from '../application/dtos/skill-matrix-attributes';
import { SkillMatrixQueryInput } from '../routes/input/skill-matrix-query.input';

export const skillMatricesRepository = {
  async findMany(
    queryDto: SkillMatrixQueryInput,
  ): Promise<{ items: WithId<SkillMatrix>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchTitleTerm,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter = {
      title: { $regex: searchTitleTerm ?? '', $options: 'i' },
    };

    const [items, totalCount] = await Promise.all([
      skillMatrixCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      skillMatrixCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<SkillMatrix> | null> {
    return skillMatrixCollection.findOne({ _id: new ObjectId(id) });
  },

  async findByIdOrFail(id: string): Promise<WithId<SkillMatrix>> {
    const res = await skillMatrixCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError('SkillMatrix not exist');
    }
    return res;
  },

  async create(newSkillMatrix: SkillMatrix): Promise<string> {
    const insertResult = await skillMatrixCollection.insertOne(newSkillMatrix);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: SkillMatrixAttributes): Promise<void> {
    const updateResult = await skillMatrixCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: dto.title,
          description: dto.description,
          is_published: dto.is_published,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError('SkillMatrix not exist');
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await skillMatrixCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('SkillMatrix not exist');
    }

    return;
  },
};
