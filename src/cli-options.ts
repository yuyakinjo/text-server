import { program } from 'commander';

program.option('-f, --filename <type>', 'fiename');
program.option('-s, --batchsize <type>', 'batchsize', '1');

program.parse(process.argv);
export const cliOptions = program.opts<{ filename: string; batchsize: string }>();
