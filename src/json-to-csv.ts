import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';
import { cliOptions } from './cli-options';
import { parser } from 'stream-json/Parser';
import { streamArray } from 'stream-json/streamers/StreamArray';

const jsonToCsv = (inputFilePath: string, outputFilePath: string) => {
  console.time('tocsv');
  const counter = {
    output: 0,
  };

  const writeStream = createWriteStream(outputFilePath);
  const readStream = createReadStream(inputFilePath);
  readStream
    .pipe(parser())
    .pipe(streamArray())
    .pipe(
      new Transform({
        objectMode: true,
        transform: (chunk, encoding, callback) => {
          counter.output++;
          const header = Object.keys(chunk.value).join(',');
          const value = Object.values(chunk.value).join(',');
          const csv = chunk.key ? `\n${value}` : `${header}\n${value}`;
          callback(null, csv);
        },
      }),
    )
    .on('data', (chunk) => {
      console.clear();
      console.group(`${filename}`, 'Json rows:', counter.output);
      writeStream.write(chunk);
    })
    .on('error', (error) => {
      console.timeEnd('tocsv');
      readStream.destroy();
      throw error;
    })
    .on('finish', () => {
      console.clear();
      console.group(`${filename}`, 'Json rows:', counter.output);
      console.log(`json to csv finish`);
      console.timeEnd('tocsv');
      readStream.destroy();
    });
};

const { filename } = cliOptions;

const inputFilePath = filename;
const outputFilePath = filename.replace('.json', '.csv');

jsonToCsv(inputFilePath, outputFilePath);
