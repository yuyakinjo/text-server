import { createReadStream, createWriteStream } from 'fs';
import { Stream } from 'stream';
import { parser } from 'stream-json/Parser';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { data, type Schema, type Data } from './schema';

class GenerateOptions {
  static filename = 'data.json';
  static sizeLength = 100;
  static checkOnly = false;

  readonly filename = GenerateOptions.filename;
  readonly sizeLength = GenerateOptions.sizeLength;
  readonly checkOnly = GenerateOptions.checkOnly;

  constructor(override?: Partial<GenerateOptions>) {
    Object.assign(this, override);
  }
}

class FakeGenerator {
  #counter = {
    input: 0,
    output: 0,
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

  generate(options?: Partial<typeof GenerateOptions>) {
    console.time('generate');

    const { filename, sizeLength, checkOnly } = new GenerateOptions(options);

    const firstLine = '[';
    const newLine = '\n';
    const comma = ',';
    const lastLine = ']';

    const readableStream = Stream.Readable.from(this.generateData(sizeLength, this.#schema), {
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
        this.#counter.input++;
        console.clear();
        console.log('Input Generating...', this.#counter.input, `/${sizeLength}`);
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

  checkLength(options?: Partial<typeof GenerateOptions>) {
    console.time('checkLength');
    const { filename, sizeLength, checkOnly } = new GenerateOptions(options);
    createReadStream(filename)
      .pipe(parser({}))
      .pipe(streamArray())
      .on('data', () => {
        this.#counter.output++;
        console.clear();
        if (!checkOnly) console.log('Input Result', this.#counter.input, `/${sizeLength}`);
        console.log('Output Counting...', this.#counter.output, `/${sizeLength}`);
      })
      .on('finish', () => {
        console.clear();
        if (!checkOnly) console.log('Input Result', this.#counter.input, `/${sizeLength}`);
        console.log('Output Result', this.#counter.output, `/${sizeLength}`);
        if (!checkOnly) console.assert(this.#counter.input === this.#counter.output, 'Input and Output are not equal');
        console.timeEnd('checkLength');
      });
  }
}

new FakeGenerator(data).generate({ sizeLength: 100_000_000, filename: '100_000_000-data.json' });
