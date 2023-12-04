import { cliOptions } from './cli-options';
import { jsonStreamGenerator } from './json-stream-generator';
const { filename, generateLength } = cliOptions;

jsonStreamGenerator({ filename, generateLength: Number(generateLength) });
