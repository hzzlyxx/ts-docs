import * as fs from "fs";
import * as parser from "@babel/parser";
import * as traverse from "@babel/traverse";

function esmToJson(filename: string) {
  const json = {};
  const code = fs.readFileSync(filename, "utf-8"); // 读取文件内容

  // 1. parse
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript"],
  });

  // 2. traverse
  const visitor = {
    // ExportDefaultDeclaration({ node }) {
    //   const { declaration } = node;
    //   console.log(node, declaration.properties);
    // },
    ObjectProperty({ node }) {
      const { key, value } = node;
      json[key.name] = value.value;
    },
  };

  traverse.default(ast, visitor);

  return json;
}

export default esmToJson;
