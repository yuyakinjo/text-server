import Fuse from "fuse.js";
// import data from "../dist/rows-10/fakes-23451b82-3ea9-58ce-14f2-2dacb523a396.json";

// type FuseData = typeof data;

// dist配下のファイル名をすべて取得する
import { readdirSync } from "fs";
import { join } from "path";
const targetFolder = "./dist/split-result/row-3000";
// const targetFolder = './dist/rows-100000';
const files = readdirSync(targetFolder, { recursive: true });

const search = async (term: string, data: any) => {
  const fuse = new Fuse(data, {
    keys: ["lastName", "firstName", "verb"],
  });
  return fuse.search(term);
};

const parallelSearch = async (term: string, files: string[] | Buffer[]) => {
  const searchTasks = files.map((filePath) =>
    import(join("../", targetFolder, filePath.toString())).then((data) => search(term, data.default)),
  );
  return await Promise.all(searchTasks);
};

const results = await parallelSearch("山田", files);
console.log("🚀 ~ results:", { count: results.flat().length });
