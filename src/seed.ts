import { dirname } from 'path';
import { Schema } from './types';
import { getDateNumsBetween, writeFile } from './utils';
import { faker } from '@faker-js/faker';

const users: Array<Schema.User> = [];

const generateUser = (): Schema.User => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  username: faker.internet.userName(),
  nickname: faker.internet.displayName(),
  age: getDateNumsBetween(faker.date.birthdate()).toString(),
  gender: 'male',
});

(() => {
  const MAX_SEED_SIZE = 1000;

  for (let i = 0; i < MAX_SEED_SIZE; i++) {
    users.push(generateUser());
  }
})();

const randomId = (min = 0, max = 15000) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const generateUserFindUniqueURL = (host = 'http://localhost:3000') =>
  `${host}/user/${randomId()}`;

const writeUserEndpoints = async () => {
  let result = '';

  for (let i = 0; i < 15000; i += 1) {
    const url = generateUserFindUniqueURL();
    result += `${url}\n`;
  }

  try {
    await writeFile(dirname(__dirname) + '/data/endpoints.csv', result);

    console.log('Done writing endpoints');
  } catch (e) {
    console.error(e);
  }
};

export { users, generateUser, writeUserEndpoints };
