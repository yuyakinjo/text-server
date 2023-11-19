// worker.jsのコード
// worker.js
import { openSync, readSync } from 'fs';
import { parentPort, workerData } from 'worker_threads';

export type Message = Record<'count', number>;

const { filePath, start, end } = workerData;
const fd = openSync(filePath, 'r');
const buffer = Buffer.allocUnsafe(end - start);
readSync(fd, buffer, 0, end - start, start);
const textLikeJson = buffer.toString();
const count = (textLikeJson.match(/},/gm) || []).length;
parentPort?.postMessage({ count } as Message);
