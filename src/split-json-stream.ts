import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import Batch from 'stream-json/utils/Batch';
import StreamArray from 'stream-json/streamers/StreamArray';
import { chain } from 'stream-chain';
import { cliOptions } from './cli-options';
import { join } from 'path';

const { filename, batchsize, output } = cliOptions;
const batchSize = Number(batchsize);

if (!filename) throw new Error('input filename is required');
if (!batchSize) throw new Error('batchSize is required');

const outputFolder = join(__dirname, '..', output, `split-into-${batchSize}`);
const outputfileName = (index: number) => `${outputFolder}/batch-${index}.json`;

// Create output folder if not exists
if (!existsSync(outputFolder)) {
  mkdirSync(outputFolder, { recursive: true });
}

const pipeline = chain([createReadStream(filename), StreamArray.withParser(), new Batch({ batchSize })]);

let savedFileLength = 0;
let rows = 0;

pipeline
  .on('data', (data) => {
    createWriteStream(outputfileName(savedFileLength++)).write(JSON.stringify(data));
    rows += data.length;
    console.clear();
    console.log({ filename, batchSize, savedFileLength, rows });
  })
  .on('drain', () => {
    console.log('drain');
  })
  .on('end', () => {
    console.clear();
    console.log({ filename, batchSize, savedFileLength, rows });
  });
