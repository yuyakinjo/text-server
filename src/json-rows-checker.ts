import { createReadStream } from 'fs';
import { parser } from 'stream-json/Parser';
import { streamArray } from 'stream-json/streamers/StreamArray';

export const jsonCheckLength = (filename: string) => {
  const counter = { input: 0 };
  const readStream = createReadStream(filename);

  const processData = () => {
    counter.input++;
    console.clear();
    console.group(`${filename}`, 'Json rows counting...', counter.input);
  };

  const onError = (error: Error) => {
    console.timeEnd('checkLength');
    readStream.destroy();
    throw error;
  };

  const onFinish = () => {
    console.clear();
    console.group(`${filename}`, 'Json rows:', counter.input);
    console.timeEnd('checkLength');
    readStream.destroy();
  };

  readStream.pipe(parser()).pipe(streamArray()).on('data', processData).on('error', onError).on('finish', onFinish);
};
