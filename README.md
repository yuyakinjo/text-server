# 100 million record perfomance check

Performance check using 100 million record database and json data

# Using Machin

- Macbook Pro
  - Chip: M1 Max
  - Memory: 64GB
  - Storage: 1TB
  - OS: macOS Sonoma 14.1

# Getting Started

## Prerequisites

- Docker
- jq command
- bun.dev

## Targets

- Postgresql
- SQLite
- Stream API(Bun)
- jq command
- json-server

## Todo

- [ ] 100 million record json data
- [ ] json data to csv
- [ ] cli enabling argument

## 100 million record json data

### Generate

```bash
bun run json:generate -f 100000000-data.json -gl 100000000
```

100_000_000 record json data will be generated in `./100000000-data.json`
Time: 68m34998s

### split 100 million record json data

```bash
bun run json:split -f 100000000-data.json -bs 100000

{
  filename: "100000000-data.json",
  batchSize: 100000,
  savedFileLength: 1000,
  rows: 100000000
}

real 98m8.832s
user 99m13.643s
sys 3m13.092s
```

### check length 100 million record json data

```bash
time bun run json:checklength -f 100000000-data.json
```

### check bytesize 100 million record json data

```bash
$ bun ./src/kbsize.ts -f 100000000-data.json

{
  KB: 52649162,
  MB: 51415,
  GB: 50,
  realStat: 53912742735
}

real 0m0.078s
user 0m0.029s
sys 0m0.028s
```

### jq command extract 1 record from 100 million record json data

outof memory. orz

```bash
time jq '.[0:1]' -r 100000000-data.json >> 1-data.json
Killed: 9

real 9m24.568s
user 7m34.883s
sys 1m15.250s
```
