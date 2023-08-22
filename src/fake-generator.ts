import { fakerJA } from '@faker-js/faker';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { times } from 'ramda';
import { config } from './config';

const { person, hacker } = fakerJA;
const { rows, folder, filename } = config;

const generate = () => ({
  lastName: person.lastName(),
  firstName: person.firstName(),
  gender: person.gender(),
  jobArea: person.jobArea(),
  sex: person.sex(),
  phase: hacker.phrase(),
  verb: hacker.verb(),
});

const fakes = times(generate, rows);

if (!existsSync(folder)) mkdirSync(folder, { recursive: true });

writeFileSync(filename, JSON.stringify(fakes, null, 2));

console.log('🚀 ~ filename:', filename);
