import { RideAttributesInput } from '../../../src/rides/input/ride-attributes.input';
import { Currency } from '../../../src/rides/types/ride';

export function getRideDto(driverId: string): RideAttributesInput {
  return {
    driverId,
    clientName: 'Bob',
    price: 200,
    currency: Currency.USD,
    fromAddress: '123 Main St, Springfield, IL',
    toAddress: '456 Elm St, Shelbyville, IL',
  };
}
