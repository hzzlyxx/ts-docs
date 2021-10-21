"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: hzzly
 * @Date: 2021-08-06 14:31:20
 * @LastEditors: hzzly
 * @LastEditTime: 2021-09-09 15:55:26
 * @Copyright: hzzly(hjingren@aliyun.com)
 * @Description: description
 */
var prettier = require("prettier");
/**
 * json 转换为 markdown
 */
var JsonToMarkdown = /** @class */ (function () {
    function JsonToMarkdown() {
    }
    JsonToMarkdown.prototype.commentToMarkDown = function (json, render) {
        var _this = this;
        return Object.keys(json)
            .map(function (key) {
            var markdownInfo = render
                ? render(key, json[key])
                : _this.renderMarkDown(key, json[key]);
            if (markdownInfo) {
                // 使用prettier美化格式
                var content = prettier.format(markdownInfo, {
                    parser: "markdown",
                });
                return content;
            }
            return "";
        })
            .join("\n");
    };
    JsonToMarkdown.prototype.renderMarkDown = function (name, data) {
        var _this = this;
        var props = data.props, ignore = data.ignore, description = data.description;
        if (ignore)
            return;
        return "## " + name + "\n  " + (description ? description + " \n" : "") + "\n  " + "## \u4EE3\u7801\u6F14\u793A \n" + "\n  " + "## API \n" + "\n  | \u5C5E\u6027 | \u63CF\u8FF0 | \u7C7B\u578B | \u9ED8\u8BA4\u503C | \u5FC5\u586B |\n  | --- | --- | --- | --- | ---|\n  " + props.map(function (prop) { return _this.renderProp(prop); }).join("") + "\n  ";
    };
    // 渲染1行属性
    JsonToMarkdown.prototype.renderProp = function (prop) {
        var name = prop.name, type = prop.type, required = prop.required, description = prop.description, _a = prop.default, defaultValue = _a === void 0 ? "-" : _a;
        return "| " + name + " | " + (description || "-") + " | " + type.replace(/\|/g, "\\|") + " | " + defaultValue + " | " + (required ? "✓" : "-") + " |\n  ";
    };
    return JsonToMarkdown;
}());
exports.default = JsonToMarkdown;
