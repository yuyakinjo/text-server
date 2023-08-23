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
  let count = 0;
  const folder = `./dist/split-result/${targetRows}-to-${splitTo}`;
  const createFilename = () => `${folder}/fakes-${randomUUID()}.json`;
  jsonStream.on('data', ({ key: index, value }) => {
    console.log(`Index ${index}:`, value);
    let writableStream = createWriteStream(createFilename());
    // index が 0 だったら [ を書き込む
    if (index === 0) {
      writableStream.write(`[\n`);
    }
    // index が splitTo と イコールであれば value を書き込む
    if (index === splitTo) {
      writableStream.write(`${JSON.stringify(value, null, 2)}\n`);
      count++;
    }
    // index が splitTo と イコールでなければ value と , を書き込む
    if (index !== splitTo) {
      writableStream.write(`${JSON.stringify(value, null, 2)},\n`);
      count++;
    }
    // index が splitTo -1 と イコールであれば ] を書き込む
    if (index === splitTo - 1) {
      writableStream.write(`${JSON.stringify(value, null, 2)}\n]`);
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
