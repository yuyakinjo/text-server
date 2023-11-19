import { cliOptions } from './cli-options';
import { FakeGenerator } from './fake-generator';
import { data } from './schema';
const { filename, generateLength } = cliOptions;

if (!filename) throw new Error('filename is required.');
if (!generateLength) {
  throw new Error(`generateLength is required. please set generateLength option. ex) -g 1000`);
}

new FakeGenerator(data).generate({ filename, generateLength: Number(generateLength) });
