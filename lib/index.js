"use strict";
/*
 * @Author: hzzly
 * @Date: 2021-08-06 17:23:41
 * @LastEditors: hzzly
 * @LastEditTime: 2021-08-06 17:57:14
 * @Copyright: hzzly(hjingren@aliyun.com)
 * @Description: description
 */
// import { TsToJson } from "./tsToJson";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonToMarkdown = exports.TsToJson = void 0;
// import { JsonToMarkdown } from "./jsonToMarkdown";
// export { TsToJson, JsonToMarkdown };
var tsToJson_1 = require("./tsToJson");
Object.defineProperty(exports, "TsToJson", { enumerable: true, get: function () { return tsToJson_1.default; } });
var jsonToMarkdown_1 = require("./jsonToMarkdown");
Object.defineProperty(exports, "JsonToMarkdown", { enumerable: true, get: function () { return jsonToMarkdown_1.default; } });