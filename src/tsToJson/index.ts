/*
 * @Author: hzzly
 * @Date: 2021-08-04 14:26:13
 * @LastEditors: hzzly
 * @LastEditTime: 2021-08-06 18:00:54
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

/**
 * Ts Interface 或 Type 类型定义转换为 json
 */
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

export default TsToJson;
