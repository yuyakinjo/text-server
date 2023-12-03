import { program } from 'commander';
import os from 'os';

program.option('-f, --filename <type>', 'filename');
program.option('-gl, --generateLength <type>', 'generateLength');
program.option('-bs, --batchsize <type>', 'batchsize', '10');
program.option('-wn, --workerNum <type>', 'workerNum', (os.cpus().length / 2).toString());
program.option('-o, --output <type>', 'output', '/outputs');

program.parse(process.argv);

export const cliOptions = program.opts<{
  filename: string;
  generateLength: string;
  batchsize: string;
  workerNum: string;
  output: string;
}>();
