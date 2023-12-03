import { Worker } from 'worker_threads';
import { Message } from './worker';
import { statSync } from 'fs';
import { cliOptions } from './cli-options';
const { filename, workerNum } = cliOptions;
console.time('jsonlength');
const fileSize = statSync(filename).size;

if (!fileSize) {
  throw new Error('File is not fount or empty.');
}
let assignWokerNum = Number(workerNum);
let chunkSize = Math.floor(fileSize / assignWokerNum);
let rows = 0;
let finishedWorkerCounter = 0;
let finishedChunkSize = 0;
for (let i = 0; i < assignWokerNum; i++) {
  const start = i * chunkSize;
  const end = i === assignWokerNum - 1 ? fileSize : (i + 1) * chunkSize;
  const worker = new Worker('./src/worker.ts', { workerData: { filePath: filename, start, end } });
  worker.on('message', ({ count }: Message) => {
    rows += count;
    finishedWorkerCounter++;
    finishedChunkSize += end - start;
    if (finishedWorkerCounter === assignWokerNum) {
      console.timeEnd('jsonlength');
    }
    console.log(`Worker ${i} finished. Count is ${count}. Total count is ${rows}.`);
    console.log({ i, finishedChunkSize, fileSize });
  });
}
