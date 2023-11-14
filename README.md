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

```bash
bun run generate:stream
```
