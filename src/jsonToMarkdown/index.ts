/*
 * @Author: hzzly
 * @Date: 2021-08-06 14:31:20
 * @LastEditors: hzzly
 * @LastEditTime: 2021-08-06 18:00:39
 * @Copyright: hzzly(hjingren@aliyun.com)
 * @Description: description
 */
import * as prettier from "prettier";
import { Interfaces, DocsType } from "../TsToJson";

/**
 * json 转换为 markdown
 */
class JsonToMarkdown {
  commentToMarkDown(json: Interfaces) {
    return Object.keys(json)
      .map((key) => {
        const markdownInfo = this.renderMarkDown(key, json[key]);
        if (markdownInfo) {
          // 使用prettier美化格式
          const content = prettier.format(markdownInfo, {
            parser: "markdown",
          });
          return content;
        }
        return "";
      })
      .join("\n");
  }

  renderMarkDown(name: string, data: Interfaces["name"]) {
    const { props, ignore, description } = data;
    if (ignore) return;
    return `## ${name} Props
  ${description ? `> ${description} \n` : ""}
  | 属性 | 描述 | 类型 | 默认值 | 必填 |
  | --- | --- | --- | --- | ---|
  ${props.map((prop) => this.renderProp(prop)).join("")}
  `;
  }

  // 渲染1行属性
  renderProp(prop: DocsType) {
    const {
      name,
      type,
      required,
      description,
      default: defaultValue = "-",
    } = prop;
    return `| ${name} | ${description || "-"} | ${type.replace(
      /\|/g,
      "\\|"
    )} | ${defaultValue} | ${required ? "✓" : "-"} |
  `;
  }
}

export default JsonToMarkdown;
