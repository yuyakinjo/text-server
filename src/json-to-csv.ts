import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';
import { parser } from 'stream-json/Parser';
import { streamArray } from 'stream-json/streamers/StreamArray';

interface Props {
  inputFilename: string;
  outputFilename?: string;
}

export const jsonToCsv = ({ inputFilename, outputFilename = inputFilename.replace('.json', '.csv') }: Props) => {
  console.time('tocsv');
  const counter = { output: 0 };

  const writeStream = createWriteStream(outputFilename);
  const readStream = createReadStream(inputFilename);

  const transform = new Transform({
    objectMode: true,
    transform: (chunk, encoding, callback) => {
      counter.output++;
      const header = Object.keys(chunk.value).join(',');
      const value = Object.values(chunk.value).join(',');
      const csv = chunk.key ? `\n${value}` : `${header}\n${value}`;
      callback(null, csv);
    },
  });

  const processData = (chunk: any) => {
    console.clear();
    console.group(`${inputFilename}`, 'Json rows:', counter.output);
    writeStream.write(chunk);
  };

  const onError = (error: any) => {
    console.timeEnd('tocsv');
    readStream.destroy();
    throw error;
  };

  const onFinish = () => {
    console.clear();
    console.group(`${inputFilename}`, 'Json rows:', counter.output);
    console.log(`json to csv finish`);
    console.timeEnd('tocsv');
    readStream.destroy();
  };

  readStream
    .pipe(parser())
    .pipe(streamArray())
    .pipe(transform)
    .on('data', processData)
    .on('error', onError)
    .on('finish', onFinish);
};
