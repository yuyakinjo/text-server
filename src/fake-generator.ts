import { fakerJA } from '@faker-js/faker';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
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

const rows = 100000;

const fakes = times(generate, rows);

const folder = `./dist/rows-${rows}`;

const filename = `${folder}/fakes-${randomUUID()}.json`;

if (!existsSync(folder)) mkdirSync(folder, { recursive: true });

writeFileSync(filename, JSON.stringify(fakes, null, 2));
