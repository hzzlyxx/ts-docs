/*
 * @Author: hzzly
 * @Date: 2021-08-04 14:26:13
 * @LastEditors: hzzly
 * @LastEditTime: 2021-08-06 15:37:08
 * @Copyright: hzzly(hjingren@aliyun.com)
 * @Description: description
 */
import * as ts from "typescript";

export interface DocsType {
  name?: string;
  type?: string;
  description?: string;
  default?: string;
  required?: boolean;
}

export interface Interfaces {
  name?: {
    description?: string;
    /** 是否不渲染 markdown */
    ignore?: string;
    props?: DocsType[];
  };
}

class TsToJson {
  checker: ts.TypeChecker;
  interfaces: Interfaces;
  types: {};

  _createProgram(fileNames: string[], options: ts.CompilerOptions) {
    this.interfaces = {};
    this.types = {};

    // 使用filename中的根文件名构建一个程序;
    const program = ts.createProgram(fileNames, options);
    // 获取检查器，我们将使用它来查找更多关于 ast 的信息
    this.checker = program.getTypeChecker();

    // 访问程序中的每个sourceFile
    for (const sourceFile of program.getSourceFiles()) {
      if (!sourceFile.isDeclarationFile) {
        // 遍历树以搜索 interface 和 type
        ts.forEachChild(sourceFile, (node) => this._visitAst(node));
      }
    }
  }

  /**
   * 访问查找导出的节点
   * @param node
   * @returns
   */
  _visitAst(node: ts.Node) {
    // 只考虑导出的节点
    if (!this._isNodeExported(node)) {
      return;
    }

    switch (ts.SyntaxKind[node.kind]) {
      case "InterfaceDeclaration":
        this.generateInterfaceDeclaration(node);
        break;
      case "TypeAliasDeclaration":
        this.generateTypeAliasDeclaration(node);
        break;
      default:
        break;
    }
  }

  /**
   * 获取 Interface 类型 json 数据
   * @param node
   */
  generateInterfaceDeclaration(node: ts.Node) {
    const newNode = node as ts.InterfaceDeclaration;
    const symbol = this.checker.getSymbolAtLocation(newNode.name);
    const { escapedName } = symbol;
    const { name = escapedName as string, ...rest } = this._getDocs(symbol);
    this.interfaces[name] = {
      ...rest,
      props: [],
    };
    symbol.members.forEach((member) => {
      this.interfaces[name].props.push(this._serializeSymbol(member));
    });
  }

  /**
   * 获取 Type 类型 json 数据
   * @param node
   */
  generateTypeAliasDeclaration(node: ts.Node) {
    const type = this.checker.typeToString(
      this.checker.getTypeAtLocation(node),
      node,
      ts.TypeFormatFlags.InTypeAlias
    );
    const name = (<any>node).name.escapedText;
    this.types[name] = type;
  }

  /**
   * 将symbol序列化为json对象
   * @param symbol
   * @returns
   */
  _serializeSymbol(symbol: ts.Symbol): DocsType {
    const docs = this._getDocs(symbol);
    const questionToken = (<any>symbol.valueDeclaration).questionToken;
    const type = this.checker.typeToString(
      this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)
    );
    let newType = type;
    if (type.indexOf("|") > 0) {
      newType = type
        .split("|")
        .map((item) => {
          const hasType = this.types[item.trim()];
          if (hasType) {
            return ` ${hasType} `;
          }
          return item;
        })
        .join("|");
    } else if (this.types[type]) {
      newType = this.types[type];
    }

    return {
      name: symbol.getName(),
      required: !questionToken,
      type: newType,
      ...docs,
    };
  }

  /**
   * 获取jsDoc信息
   * @param symbol
   * @returns
   */
  _getDocs(symbol: ts.Symbol): DocsType {
    const docs: DocsType = {};
    if (Array.isArray(symbol.getJsDocTags(this.checker))) {
      symbol.getJsDocTags(this.checker).forEach((tag) => {
        docs[tag.name] = tag.text[0].text;
      });
    }
    return docs;
  }

  /**
   * 如果在文件外部可见，则为True，否则为false
   * @param node
   * @returns boolean
   */
  _isNodeExported(node: ts.Node): boolean {
    return (
      (ts.getCombinedModifierFlags(node as ts.Declaration) &
        ts.ModifierFlags.Export) !==
        0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }

  parse(
    fileNames: string[],
    options: ts.CompilerOptions = {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
    }
  ) {
    this._createProgram(fileNames, options);
    return this.interfaces;
  }
}

export default new TsToJson();

// /** 在一个.ts文件中生成 interface 的文档 */
// function generateDocumentation(
//   fileNames: string[],
//   options: ts.CompilerOptions
// ): void {
//   console.log(fileNames);

//   // debugger;
//   // 使用filename中的根文件名构建一个程序
//   let program = ts.createProgram(fileNames, options);

//   // 获取检查器，我们将使用它来查找更多关于 interface 的信息
//   let checker = program.getTypeChecker();
//   let interfaces: Interfaces = {};
//   let types = {};

//   // 访问程序中的每个sourceFile
//   for (const sourceFile of program.getSourceFiles()) {
//     if (!sourceFile.isDeclarationFile) {
//       // 遍历树以搜索 interface 和 type
//       ts.forEachChild(sourceFile, visit);
//     }
//   }

//   // 生成markdown文档
//   fs.writeFileSync("index.md", commentToMarkDown(interfaces));

//   // 把提取的信息转换成markdown格式
//   function commentToMarkDown(interfaces: Interfaces) {
//     return Object.keys(interfaces)
//       .map((key) => {
//         const markdownInfo = renderMarkDown(key, interfaces[key]);
//         if (markdownInfo) {
//           // 使用prettier美化格式
//           const content = prettier.format(markdownInfo, {
//             parser: "markdown",
//           });
//           return content;
//         }
//         return "";
//       })
//       .join("\n");
//   }

//   function renderMarkDown(name: string, data: Interfaces["name"]) {
//     const { props, ignore, description } = data;
//     if (ignore) return;
//     return `## ${name} Props
//   ${description ? `> ${description} \n` : ""}
//   | 属性 | 描述 | 类型 | 默认值 | 必填 |
//   | --- | --- | --- | --- | ---|
//   ${props.map((prop) => renderProp(prop)).join("")}
//   `;
//   }

//   // 渲染1行属性
//   function renderProp(prop: DocsType) {
//     const {
//       name,
//       type,
//       required,
//       description,
//       default: defaultValue = "-",
//     } = prop;
//     return `| ${name} | ${description || "-"} | ${type.replace(
//       /\|/g,
//       "\\|"
//     )} | ${defaultValue} | ${required ? "✓" : "-"} |
//   `;
//   }

//   // print out the doc
//   // fs.writeFileSync("classes.json", JSON.stringify(interfaces, undefined, 2));

//   return;

//   /** 访问查找导出的节点 */
//   function visit(node: ts.Node) {
//     // 只考虑导出的节点
//     if (!isNodeExported(node)) {
//       return;
//     }

//     switch (ts.SyntaxKind[node.kind]) {
//       case "InterfaceDeclaration":
//         generateInterfaceDeclaration(node);
//         break;
//       case "TypeAliasDeclaration":
//         generateTypeAliasDeclaration(node);
//         break;
//       default:
//         break;
//     }
//   }

//   function generateInterfaceDeclaration(node: ts.Node) {
//     const newNode = node as ts.InterfaceDeclaration;
//     const symbol = checker.getSymbolAtLocation(newNode.name);
//     const { escapedName } = symbol;
//     const { name = escapedName as string, ...rest } = getDocs(symbol);
//     interfaces[name] = {
//       ...rest,
//       props: [],
//     };
//     symbol.members.forEach((member) => {
//       interfaces[name].props.push(serializeSymbol(member));
//     });
//   }

//   function generateTypeAliasDeclaration(node: ts.Node) {
//     const type = checker.typeToString(
//       checker.getTypeAtLocation(node),
//       node,
//       ts.TypeFormatFlags.InTypeAlias
//     );
//     const name = (<any>node).name.escapedText;
//     types[name] = type;
//   }

//   /** 将symbol序列化为json对象 */
//   function serializeSymbol(symbol: ts.Symbol): DocsType {
//     const docs = getDocs(symbol);
//     const questionToken = (<any>symbol.valueDeclaration).questionToken;
//     const type = checker.typeToString(
//       checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)
//     );
//     let newType = type;
//     if (type.indexOf("|") > 0) {
//       newType = type
//         .split("|")
//         .map((item) => {
//           const hasType = types[item.trim()];
//           if (hasType) {
//             return ` ${hasType} `;
//           }
//           return item;
//         })
//         .join("|");
//     } else if (types[type]) {
//       newType = types[type];
//     }

//     return {
//       name: symbol.getName(),
//       required: !questionToken,
//       type: newType,
//       ...docs,
//     };
//   }

//   function getDocs(symbol: ts.Symbol): DocsType {
//     const docs: DocsType = {};
//     if (Array.isArray(symbol.getJsDocTags(checker))) {
//       symbol.getJsDocTags(checker).forEach((tag) => {
//         docs[tag.name] = tag.text[0].text;
//       });
//     }
//     return docs;
//   }

//   /** 如果在文件外部可见，则为True，否则为false */
//   function isNodeExported(node: ts.Node): boolean {
//     return (
//       (ts.getCombinedModifierFlags(node as ts.Declaration) &
//         ts.ModifierFlags.Export) !==
//         0 ||
//       (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
//     );
//   }
// }

// generateDocumentation(process.argv.slice(2), {
//   target: ts.ScriptTarget.ES5,
//   module: ts.ModuleKind.CommonJS,
// });
