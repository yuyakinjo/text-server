import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import Batch from 'stream-json/utils/Batch';
import StreamArray from 'stream-json/streamers/StreamArray';
import { chain } from 'stream-chain';

interface Props {
  filename: string;
  outputFolder?: string;
  splitSize?: number;
}

export const jsonSplitter = ({ filename, outputFolder = 'outputs', splitSize = 1000 }: Props) => {
  const outputFolderName = `${outputFolder}/split-size-${splitSize}`;
  const outputfileName = (index: number) => `${outputFolderName}/split-${splitSize}-${index}.json`;

  // Create output folder if not exists
  if (!existsSync(outputFolderName)) {
    mkdirSync(outputFolderName, { recursive: true });
  }

  const pipeline = chain([createReadStream(filename), StreamArray.withParser(), new Batch({ batchSize: splitSize })]);

  let savedFileLength = 0;
  let rows = 0;

  pipeline
    .on('data', (data) => {
      createWriteStream(outputfileName(savedFileLength++)).write(JSON.stringify(data));
      rows += data.length;
      console.clear();
      console.log({ filename, splitSize, savedFileLength, rows });
    })
    .on('drain', () => {
      console.log('drain');
    })
    .on('finish', () => {
      console.clear();
      console.log({ filename, splitSize, savedFileLength, rows });
      pipeline.destroy();
    });
};
