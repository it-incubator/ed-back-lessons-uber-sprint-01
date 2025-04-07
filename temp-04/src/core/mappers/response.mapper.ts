// Типы для JSON:API структуры
import { ObjectId } from 'mongodb';

type Entity = {
  _id: ObjectId;
  [key: string]: any;
};

type Meta = {
  [key: string]: any;
};

type JsonApiResponse<T> = {
  meta: Meta;
  data: {
    type: string;
    id: string;
    attributes: T;
  }[];
};

// Универсальный обработчик
export function formatJsonApiResponse<T>(params: {
  entities: Entity[];
  entityType: string;
  meta: Meta;
  attributeMapper: (entity: any) => T;
}): JsonApiResponse<T> {
  const { entities, entityType, meta, attributeMapper } = params;

  return {
    meta,
    data: entities.map((entity) => ({
      type: entityType,
      id: entity._id.toString(),
      attributes: attributeMapper(entity),
    })),
  };
}
