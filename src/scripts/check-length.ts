import { jsonCheckLength } from '../json-rows-checker';
import { cliOptions } from '../cli-options';

const { filename } = cliOptions;
if (!filename) throw new Error('filename is required.');

jsonCheckLength(filename);
