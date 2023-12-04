import { cliOptions } from '../cli-options';
import { kbsize } from '../kbsize';

const { filename } = cliOptions;
if (!filename) throw new Error('filename is required.');

kbsize(filename);
