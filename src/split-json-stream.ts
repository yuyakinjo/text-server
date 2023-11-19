import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import Batch from 'stream-json/utils/Batch';
import StreamArray from 'stream-json/streamers/StreamArray';
import { chain } from 'stream-chain';

const inputFileName = '1000000-data.json';
const inputFilePath = `${__dirname}/../${inputFileName}`;
const batchSize = 1000;
const outputFolderPath = `${__dirname}/../outputs/data-to-${batchSize}/`;
const outputfileName = (index: number) => `${outputFolderPath}batch-${index}.json`;

// Create output folder if not exists
if (!existsSync(outputFolderPath)) {
  mkdirSync(outputFolderPath, { recursive: true });
}

const pipeline = chain([createReadStream(inputFilePath), StreamArray.withParser(), new Batch({ batchSize })]);

let savedFileLength = 0;
let rows = 0;

pipeline
  .on('data', (data) => {
    createWriteStream(outputfileName(savedFileLength++)).write(JSON.stringify(data));
    rows += data.length;
    console.clear();
    console.log({ inputFileName, batchSize, savedFileLength, rows });
  })
  .on('drain', () => {
    console.log('drain');
  })
  .on('end', () => {
    console.clear();
    console.log({ inputFileName, batchSize, savedFileLength, rows });
  });
