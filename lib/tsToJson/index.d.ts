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
 * Ts Interface 类型定义转换为 json
 */
declare class TsToJson {
    checker: ts.TypeChecker;
    interfaces: Interfaces;
    fileNames: string[];
    types: {};
    _createProgram(fileNames: string[], options: ts.CompilerOptions): void;
    /**
     * 访问查找导出的节点
     * @param node
     * @returns
     */
    _visitAst(node: ts.Node): void;
    /**
     * 获取 Interface 类型 json 数据
     * @param node
     */
    generateInterfaceDeclaration(node: ts.Node): void;
    /**
     * 获取 Type 类型 json 数据
     * @param node
     */
    generateTypeAliasDeclaration(node: ts.Node): void;
    /**
     * 将symbol序列化为json对象
     * @param symbol
     * @returns
     */
    _serializeSymbol(symbol: ts.Symbol): DocsType;
    /**
     * 获取jsDoc信息
     * @param symbol
     * @returns
     */
    _getDocs(symbol: ts.Symbol): DocsType;
    /**
     * 如果在文件外部可见，则为True，否则为false
     * @param node
     * @returns boolean
     */
    _isNodeExported(node: ts.Node): boolean;
    parse(fileNames: string, options?: ts.CompilerOptions): Interfaces;
}
export default TsToJson;
