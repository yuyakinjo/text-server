import { cliOptions } from '../cli-options';
import { jsonToCsv } from '../json-to-csv';

const { filename } = cliOptions;
if (!filename) throw new Error('filename is required.');

jsonToCsv({ inputFilename: filename });
