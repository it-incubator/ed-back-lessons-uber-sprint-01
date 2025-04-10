import { ResourceType } from '../../core/types/resource-type';
import { DriverAttributesInput } from './driver-attributes.input';

export type DriverUpdateInput = {
  data: {
    type: ResourceType.Drivers;
    id: string;
    attributes: DriverAttributesInput;
  };
};
