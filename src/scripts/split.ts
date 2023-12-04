import { cliOptions } from '../cli-options';
import { jsonSplitter } from '../json-splitter';

const { filename, splitSize } = cliOptions;
if (!filename) throw new Error('input filename is required. ex) -f 1000-data.json');

jsonSplitter({ filename, splitSize: Number(splitSize) });
