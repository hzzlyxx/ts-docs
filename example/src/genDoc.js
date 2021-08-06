"use strict";
exports.__esModule = true;
/*
 * @Author: hzzly
 * @Date: 2021-08-06 17:24:48
 * @LastEditors: hzzly
 * @LastEditTime: 2021-08-06 17:48:47
 * @Copyright: hzzly(hjingren@aliyun.com)
 * @Description: description
 */
var fs = require("fs");
var path = require("path");
var lib_1 = require("../../lib");
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
                    var ts2Json = new lib_1.TsToJson();
                    var json = ts2Json.parse(["" + typePath]);
                    var json2Markdown = new lib_1.JsonToMarkdown();
                    fs.writeFileSync(path.join(dir, "./" + d + "/" + f + "/index.md"), json2Markdown.commentToMarkDown(json));
                }
            });
        }
    });
}
console.time();
readFiles();
console.timeEnd();
