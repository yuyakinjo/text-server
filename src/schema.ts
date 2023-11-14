import { faker } from '@faker-js/faker/locale/ja';

export const data = () => ({
  id: `${faker.string.uuid()}`,
  name: `${faker.person.lastName()} ${faker.person.firstName()}`,
  kana: `${faker.person.lastName()} ${faker.person.firstName()}`,
  email: faker.internet.email(),
  company_name: faker.company.name(),
  joined_at: faker.date.recent(),
  created_at: faker.date.past(),
  updated_at: faker.date.past(),
});

export type Data = typeof data;
export type Schema = ReturnType<Data>;
