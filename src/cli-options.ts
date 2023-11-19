import { program } from 'commander';
import os from 'os';

program.option('-f, --filename <type>', 'fiename');
program.option('-g, --generateLength <type>', 'generateLength');
program.option('-s, --batchsize <type>', 'batchsize', '1');
program.option('-w, --workerNum <type>', 'workerNum', (os.cpus().length / 2).toString());

program.parse(process.argv);

export const cliOptions = program.opts<{
  filename: string;
  generateLength: string;
  batchsize: string;
  workerNum: string;
}>();
