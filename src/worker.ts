// worker.jsのコード
// worker.js
import { openSync, readSync } from 'fs';
import { parentPort, workerData } from 'worker_threads';

export type Message = Record<'count', number>;

const { filePath, start, end } = workerData;
const readonly = 'r';
const fd = openSync(filePath, readonly);
const buffer = Buffer.allocUnsafe(end - start);
readSync(fd, buffer, 0, end - start, start);
const textLikeJson = buffer.toString();

const connectionPartOfJson = new RegExp(/},/gm);
const lastJson = new RegExp(/\}]/);

const startStrings = (textLikeJson.match(lastJson) || []).length;
const connections = (textLikeJson.match(connectionPartOfJson) || []).length;

const count = connections + startStrings;
parentPort?.postMessage({ count } as Message);
