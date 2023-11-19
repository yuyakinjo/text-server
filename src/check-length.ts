import { cliOptions } from './cli-options';
import { FakeGenerator } from './fake-generator';
import { data } from './schema';
const { filename } = cliOptions;

if (!filename) {
  throw new Error('filename is required.');
}

new FakeGenerator(data).checkLength({ filename: cliOptions.filename });
