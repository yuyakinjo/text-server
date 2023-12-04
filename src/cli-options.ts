import { program } from 'commander';
import os from 'os';

program.option('-f, --filename <type>', 'filename');
program.option('-gl, --generateLength <type>', 'generateLength');
program.option('-s, --splitSize <type>', 'splitsize', '1000');
program.option('-wn, --workerNum <type>', 'workerNum', (os.cpus().length / 2).toString());
program.option('-o, --output <type>', 'output', '/outputs');

program.parse(process.argv);

export const cliOptions = program.opts<{
  filename: string;
  generateLength: string;
  splitSize: string;
  workerNum: string;
  output: string;
}>();
