import { faker } from '@faker-js/faker';
import { TItemData } from '../../src/types/ItemsTypes';

function itemFactory(): TItemData {
  return {
    title: faker.lorem.words(3),
    url: faker.internet.url(),
    description: faker.lorem.sentence(),
    amount: parseInt(faker.random.numeric(2))
  };
}

export default itemFactory;