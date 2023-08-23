import { splitEvery } from 'ramda';
import { createReadStream, createWriteStream, existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';

const targetRows = 100;
const splitTo = 30;
const targetFolder = `./dist/rows-${targetRows}`;
const files = readdirSync(targetFolder, { recursive: true });

if (splitTo >= targetRows) {
  console.error('error: because nonsplitTo >= targetRows');
  process.exit(0);
}

const folder = `./dist/split-result/${targetRows}-to-${splitTo}`;

if (!existsSync(folder)) mkdirSync(folder, { recursive: true });

const jsonStream = streamArray();

files.forEach((filename) => {
  const filePath = join(__dirname, '../', targetFolder, filename.toString());
  const folder = `./dist/split-result/${targetRows}-to-${splitTo}`;
  const createFilename = () => `${folder}/fakes-${randomUUID()}.json`;
  const newLine = '\n';
  let count = 0;
  let writableStream = createWriteStream(createFilename());
  jsonStream.on('data', ({ key, value }) => {
    if (count === 0) {
      writableStream.write(`[\n${JSON.stringify(value, null, 2)},${newLine}`);
      count++;
    } else if (count === splitTo) {
      writableStream.write(`${JSON.stringify(value, null, 2)}${newLine}]`);
      writableStream.end();
      count = 0;
      writableStream = createWriteStream(createFilename());
    } else {
      writableStream.write(`${JSON.stringify(value, null, 2)},${newLine}`);
      count++;
    }
  });

  jsonStream.on('end', () => {
    console.log('All done');
  });

  createReadStream(filePath).pipe(parser()).pipe(jsonStream);
});

// files.forEach(async (filePath) => {
//   const data = await import(join('../', targetFolder, filePath.toString()));
//   splitEvery(splitTo, data.default).forEach((row) => {
//     const folder = `./dist/split-result/${targetRows}-to-${splitTo}`;
//     const filename = `${folder}/fakes-${randomUUID()}.json`;
//     if (!existsSync(folder)) mkdirSync(folder, { recursive: true });

//     writeFileSync(filename, JSON.stringify(row, null, 2));
//   });
// });
