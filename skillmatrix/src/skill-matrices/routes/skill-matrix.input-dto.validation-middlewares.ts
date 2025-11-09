import { body } from 'express-validator';
import { dataIdMatchValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { resourceTypeValidation } from '../../core/middlewares/validation/resource-type.validation-middleware';
import { ResourceType } from '../../core/types/resource-type';

const titleValidation = body('data.attributes.title')
  .isString()
  .withMessage('title should be string')
  .trim()
  .isLength({ min: 3, max: 200 })
  .withMessage('Length of title is not correct');

const descriptionValidation = body('data.attributes.description')
  .isString()
  .withMessage('description should be string')
  .trim()
  .isLength({ min: 10, max: 1000 })
  .withMessage('Length of description is not correct');

const isPublishedValidation = body('data.attributes.is_published')
  .isBoolean()
  .withMessage('is_published should be boolean');

export const skillMatrixCreateInputValidation = [
  resourceTypeValidation(ResourceType.SkillMatrices),
  titleValidation,
  descriptionValidation,
  isPublishedValidation,
];

export const skillMatrixUpdateInputValidation = [
  resourceTypeValidation(ResourceType.SkillMatrices),
  dataIdMatchValidation,
  titleValidation,
  descriptionValidation,
  isPublishedValidation,
];
