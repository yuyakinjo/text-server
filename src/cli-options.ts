import { program } from 'commander';
import os from 'os';

program.option('-f, --filename <type>', 'fiename');
program.option('-g, --generateLength <type>', 'generateLength');
program.option('-s, --batchsize <type>', 'batchsize', '10');
program.option('-w, --workerNum <type>', 'workerNum', (os.cpus().length / 2).toString());
program.option('-o, --output <type>', 'output', '/outputs');

program.parse(process.argv);

export const cliOptions = program.opts<{
  filename: string;
  generateLength: string;
  batchsize: string;
  workerNum: string;
  output: string;
}>();
