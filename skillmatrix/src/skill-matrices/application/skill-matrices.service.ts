import { skillMatricesRepository } from '../repositories/skill-matrices.repository';
import { WithId } from 'mongodb';
import { SkillMatrix } from '../domain/skill-matrix';
import { SkillMatrixAttributes } from './dtos/skill-matrix-attributes';
import { SkillMatrixQueryInput } from '../routes/input/skill-matrix-query.input';

export const skillMatricesService = {
  async findMany(
    queryDto: SkillMatrixQueryInput,
  ): Promise<{ items: WithId<SkillMatrix>[]; totalCount: number }> {
    return skillMatricesRepository.findMany(queryDto);
  },

  async findByIdOrFail(id: string): Promise<WithId<SkillMatrix>> {
    return skillMatricesRepository.findByIdOrFail(id);
  },

  async create(dto: SkillMatrixAttributes): Promise<string> {
    const newSkillMatrix: SkillMatrix = {
      title: dto.title,
      description: dto.description,
      is_published: dto.is_published,
      createdAt: new Date(),
    };

    return skillMatricesRepository.create(newSkillMatrix);
  },

  async update(id: string, dto: SkillMatrixAttributes): Promise<void> {
    await skillMatricesRepository.findByIdOrFail(id); // throws 404 if not found
    await skillMatricesRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    await skillMatricesRepository.findByIdOrFail(id); // throws 404 if not found
    await skillMatricesRepository.delete(id);
    return;
  },
};
