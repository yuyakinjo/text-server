import { splitEvery } from 'ramda';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
const targetFolder = './dist/rows-100000';
const files = readdirSync(targetFolder, { recursive: true });

files.forEach(async (filePath) => {
  const data = await import(join('../', targetFolder, filePath.toString()));
  splitEvery(3000, data.default).forEach((row) => {
    const folder = `./dist/split-result/row-${row.length}`;
    const filename = `${folder}/fakes-${randomUUID()}.json`;
    if (!existsSync(folder)) mkdirSync(folder, { recursive: true });

    writeFileSync(filename, JSON.stringify(row, null, 2));
  });
});
