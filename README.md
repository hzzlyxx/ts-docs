### TypeScript 接口定义

```ts
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
