import { createReadStream, createWriteStream } from 'fs';
import { Stream } from 'stream';
import { parser } from 'stream-json/Parser';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { type Schema, type Data } from './schema';

export class FakeGenerator {
  readonly counter = {
    input: 0,
    output: 0,
  };

  private generateOptions = {
    filename: 'data.json',
    generateLength: 100,
  };

  get #schema() {
    return this.schema;
  }

  constructor(private schema: Data) {}

  private *generateData(num: number, schema: () => Schema) {
    for (let i = 0; i < num; i++) {
      yield schema();
    }
  }

  generate(options?: FakeGenerator['generateOptions']) {
    console.time('generate');

    this.generateOptions = { ...this.generateOptions, ...options };
    const { filename, generateLength } = this.generateOptions;

    const firstLine = '[';
    const newLine = '\n';
    const comma = ',';
    const lastLine = ']';

    const readableStream = Stream.Readable.from(this.generateData(generateLength, this.#schema), {
      objectMode: true,
    });

    const writableStream = createWriteStream(filename);
    writableStream.write(firstLine); // start of array
    writableStream.on('drain', () => {
      readableStream.resume();
    });

    let isFirstChunk = true;

    readableStream
      .on('data', (data) => {
        if (!isFirstChunk) writableStream.write(`${comma}${newLine}`);

        writableStream.write(JSON.stringify(data));
        this.counter.input++;
        console.clear();
        console.log('Input Generating...', this.counter.input, `/${generateLength}`);
        isFirstChunk = false;
      })
      .on('end', () => {
        writableStream.write(`${lastLine}${newLine}`);
        writableStream.end();
      });

    writableStream.on('finish', () => {
      console.timeEnd('generate');
    });

    return this;
  }

  checkLength(options?: Partial<FakeGenerator['generateOptions']>) {
    console.time('checkLength');
    this.generateOptions = { ...this.generateOptions, ...options };
    const { filename } = this.generateOptions;
    const readStream = createReadStream(filename);
    readStream
      .pipe(parser())
      .pipe(streamArray())
      .on('data', () => {
        this.counter.output++;
        console.clear();
        console.group(`${filename}`, 'Json rows counting...', this.counter.output);
      })
      .on('error', (error) => {
        console.timeEnd('checkLength');
        readStream.destroy();
        throw error;
      })
      .on('finish', () => {
        console.clear();
        console.group(`${filename}`, 'Json rows:', this.counter.output);
        console.timeEnd('checkLength');
        readStream.destroy();
      });
  }
}
