import { cliOptions } from '../cli-options';
import { jsonStreamGenerator } from '../json-generator';
const { filename, generateLength } = cliOptions;

jsonStreamGenerator({ filename, generateLength: Number(generateLength) });
