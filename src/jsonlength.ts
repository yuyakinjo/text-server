import fs from 'fs';
import { join } from 'path';
import { Worker } from 'worker_threads';
import { Message } from './worker';

const filePath = join(__dirname, '..', '1000-data.json');

// jsonの行数を数える

const fileSize = fs.statSync(filePath).size;
let workerNum = 1; // 並列に実行するWorkerの数を指定します。この数値はCPUのコア数に応じて調整してください。
let chunkSize = Math.ceil(fileSize / workerNum);
console.log('🚀 ~ chunkSize:', chunkSize);

let rows = 1;
let finishedWorkerCounter = 0;

for (let i = 0; i < workerNum; i++) {
  const start = i * chunkSize;
  const end = i === workerNum - 1 ? fileSize : start + chunkSize;
  const worker = new Worker('./src/worker.ts', { workerData: { filePath, start, end } });
  worker.on('message', ({ count }: Message) => {
    rows += count;
    finishedWorkerCounter++;
    console.log(`Worker ${i} finished. Count is ${count}. Total count is ${rows}.`);
  });
}
