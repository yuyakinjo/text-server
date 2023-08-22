import { fakerJA } from '@faker-js/faker';
import { writeFileSync } from 'fs';
import { times } from 'ramda';
import { randomUUID } from 'crypto';

const { person, hacker } = fakerJA;

const generate = () => ({
  lastName: person.lastName(),
  firstName: person.firstName(),
  gender: person.gender(),
  jobArea: person.jobArea(),
  sex: person.sex(),
  phase: hacker.phrase(),
  verb: hacker.verb(),
});

const rows = 1000000;

const fakes = times(generate, rows);

const filename = `./${rows}-fakes-${randomUUID()}.json`;

writeFileSync(filename, JSON.stringify(fakes, null, 2));
