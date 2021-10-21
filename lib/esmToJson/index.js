"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var parser = require("@babel/parser");
var traverse = require("@babel/traverse");
function esmToJson(filename) {
    var json = {};
    var code = fs.readFileSync(filename, "utf-8"); // 读取文件内容
    // 1. parse
    var ast = parser.parse(code, {
        sourceType: "module",
        plugins: ["typescript"],
    });
    // 2. traverse
    var visitor = {
        // ExportDefaultDeclaration({ node }) {
        //   const { declaration } = node;
        //   console.log(node, declaration.properties);
        // },
        ObjectProperty: function (_a) {
            var node = _a.node;
            var key = node.key, value = node.value;
            json[key.name] = value.value;
        },
    };
    traverse.default(ast, visitor);
    return json;
}
exports.default = esmToJson;
