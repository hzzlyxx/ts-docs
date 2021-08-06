"use strict";
exports.__esModule = true;
/*
 * @Author: hzzly
 * @Date: 2021-08-06 14:50:46
 * @LastEditors: hzzly
 * @LastEditTime: 2021-08-06 15:44:17
 * @Copyright: hzzly(hjingren@aliyun.com)
 * @Description: description
 */
var fs = require("fs");
var path = require("path");
var JsonToMarkdown_1 = require("./JsonToMarkdown");
var TsToJson_1 = require("./TsToJson");
function readFiles() {
    var dir = path.join(__dirname, "../src");
    var dirs = fs
        .readdirSync(dir)
        .filter(function (f) { return f.indexOf(".") < 0 && f.toLowerCase().indexOf("components") > -1; });
    dirs.forEach(function (d) {
        var absolutePath = path.join(dir, d);
        if (fs.lstatSync(dir).isDirectory()) {
            fs.readdirSync(absolutePath).forEach(function (f) {
                var typePath = path.join(dir, "./" + d + "/" + f + "/type.ts");
                if (fs.existsSync(typePath)) {
                    var json = TsToJson_1["default"].parse(["" + typePath]);
                    var json2Markdown = new JsonToMarkdown_1["default"]();
                    fs.writeFileSync(path.join(dir, "./" + d + "/" + f + "/index.md"), json2Markdown.commentToMarkDown(json));
                }
            });
        }
    });
}
console.time();
readFiles();
console.timeEnd();
