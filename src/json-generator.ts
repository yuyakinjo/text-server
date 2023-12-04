import { Stream } from 'stream';
import { Schema } from './schema';
import { data } from './schema';
import { createWriteStream } from 'fs';

function* generateData(num: number, schema: () => Schema) {
  for (let i = 0; i < num; i++) {
    yield schema();
  }
}

interface Props {
  generateLength?: number;
  filename?: string;
}

export const jsonStreamGenerator = ({ generateLength = 1000, filename = `${generateLength}-data.json` }: Props) => {
  const readableStream = Stream.Readable.from(generateData(generateLength, data), { objectMode: true });
  const writableStream = createWriteStream(filename);

  const firstLine = '[';
  const newLine = '\n';
  const comma = ',';
  const lastLine = ']';

  writableStream.write(firstLine); // start of array
  writableStream.on('drain', () => {
    readableStream.resume(); // restart readable stream
  });

  const counter = { input: 0 };

  let isFirstChunk = true;

  readableStream
    .on('data', (data) => {
      if (!isFirstChunk) writableStream.write(`${comma}${newLine}`);

      writableStream.write(JSON.stringify(data));
      counter.input++;
      console.clear();
      console.log('Input Generating...', counter.input, `/${generateLength}`);
      isFirstChunk = false;
    })
    .on('end', () => {
      writableStream.write(`${lastLine}${newLine}`);
      writableStream.end();
    });

  writableStream.on('finish', () => {
    console.timeEnd('generate');
  });
};
