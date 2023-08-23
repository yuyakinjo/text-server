import { splitEvery } from 'ramda';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
const targetRows = 100000000;
const splitTo = 3000;
const targetFolder = `./dist/rows-${targetRows}`;
const files = readdirSync(targetFolder, { recursive: true });

files.forEach(async (filePath) => {
  const data = await import(join('../', targetFolder, filePath.toString()));
  splitEvery(splitTo, data.default).forEach((row) => {
    const folder = `./dist/split-result/${targetRows}-to-${splitTo}`;
    const filename = `${folder}/fakes-${randomUUID()}.json`;
    if (!existsSync(folder)) mkdirSync(folder, { recursive: true });

    writeFileSync(filename, JSON.stringify(row, null, 2));
  });
});
