import { ResourceType } from '../../core/types/resource-type';
import { DriverAttributesInput } from './driver-attributes.input';

export type DriverCreateInput = {
  data: {
    type: ResourceType.Drivers;
    attributes: DriverAttributesInput;
  };
};
