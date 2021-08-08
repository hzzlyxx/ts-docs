### Examples

```ts
import * as fs from "fs";
import { TsToJson, JsonToMarkdown } from "@hzzlyxx/ts-docs";

const ts2Json = new TsToJson();
const json2Markdown = new JsonToMarkdown();
const json = ts2Json.parse(["./type.ts"]); // fileName 文件路径
fs.writeFileSync(
  path.join(dir, `./index.md`),
  json2Markdown.commentToMarkDown(json)
);
```

### TypeScript 接口定义

```ts
// type.ts
/**
 * @name Button
 * @description 按钮组件
 */
export interface ButtonProps {
  /**
   * @description Button 类型
   */
  htmlType?: "button" | "submit" | "reset";
  ...
}
```

### 转换为 json 对象

```json
{
  "Button": {
    "description": "按钮组件",
    "props": [
      {
        "name": "htmlType",
        "type": "\"button\" | \"submit\" | \"reset\"",
        "default": "",
        "description": "Button 类型",
        "required": false
      }
      ...
    ]
  }
}
```

### 生成 MarkDown

| 属性     | 描述        | 类型                            | 默认值 | 必填 |
| -------- | ----------- | ------------------------------- | ------ | ---- |
| htmlType | Button 类型 | "button" \| "submit" \| "reset" | -      | -    |
