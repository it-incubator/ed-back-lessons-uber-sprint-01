import { ResourceType } from '../../core/types/resource-type';
import { RideAttributesInput } from './ride-attributes.input';

export type RideCreateInput = {
  data: {
    type: ResourceType.Rides;
    attributes: RideAttributesInput;
  };
};
