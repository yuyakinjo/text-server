import { fakerJA } from '@faker-js/faker';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { Readable } from 'stream';
import { config } from './config';

const { person, hacker } = fakerJA;

const { rows, folder, filename } = config;

if (!existsSync(folder)) mkdirSync(folder, { recursive: true });

const writableStream = createWriteStream(filename);

const generator = function* generate() {
  for (let i = 0; i < rows; i++) {
    if (i === 0) yield `[\n`;

    if (i === rows - 1)
      yield `{
      "lastName": "${person.lastName()}",
      "firstName": "${person.firstName()}",
      "gender": "${person.gender()}",
      "jobArea": "${person.jobArea()}",
      "sex": "${person.sex()}",
      "phase": "${hacker.phrase()}",
      "verb": "${hacker.verb()}"
    }\n]`;
    else
      yield `{
      "lastName": "${person.lastName()}",
      "firstName": "${person.firstName()}",
      "gender": "${person.gender()}",
      "jobArea": "${person.jobArea()}",
      "sex": "${person.sex()}",
      "phase": "${hacker.phrase()}",
      "verb": "${hacker.verb()}"
    },\n`;
  }
};

const readableStream = Readable.from(generator());

readableStream.pipe(writableStream);

console.log('🚀 ~ filename:', filename);
