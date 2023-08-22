import { randomUUID } from 'crypto';

const rows = 100000;
const folder = `./dist/rows-${rows}`;
const filename = `${folder}/fakes-${randomUUID()}.json`;

export const config = {
  rows,
  folder,
  filename,
};
