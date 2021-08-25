/*
 * @Author: hzzly
 * @Date: 2021-08-06 17:24:48
 * @LastEditors: hzzly
 * @LastEditTime: 2021-08-25 10:37:55
 * @Copyright: hzzly(hjingren@aliyun.com)
 * @Description: description
 */
import * as fs from "fs";
import * as path from "path";
import { TsToJson, JsonToMarkdown } from "../../lib";

function readFiles() {
  const dir = path.join(__dirname, "../src");
  const dirs = fs
    .readdirSync(dir)
    .filter(
      (f) => f.indexOf(".") < 0 && f.toLowerCase().indexOf("components") > -1
    );
  dirs.forEach((d) => {
    const absolutePath = path.join(dir, d);
    if (fs.lstatSync(dir).isDirectory()) {
      fs.readdirSync(absolutePath).forEach((f) => {
        const typePath = path.join(dir, `./${d}/${f}/type.ts`);
        if (fs.existsSync(typePath)) {
          const ts2Json = new TsToJson();
          const json = ts2Json.parse(typePath);
          const json2Markdown = new JsonToMarkdown();
          fs.writeFileSync(
            path.join(dir, `./${d}/${f}/index.md`),
            json2Markdown.commentToMarkDown(json)
          );
        }
      });
    }
  });
}

console.time();
readFiles();
console.timeEnd();
