import { statSync } from 'fs';
import { cliOptions } from './cli-options';

export const size = (filePath: string) => {
  const { size } = statSync(filePath);
  const KB = size / 1024;
  const MB = KB / 1024;
  const GB = MB / 1024;

  const unit = {
    KB: Math.floor(KB),
    MB: Math.floor(MB),
    GB: Math.floor(GB),
    realStat: size,
  };

  console.table(unit);

  return unit;
};

if (cliOptions) {
  size(cliOptions.filename);
}
