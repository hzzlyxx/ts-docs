"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: hzzly
 * @Date: 2021-08-04 14:26:13
 * @LastEditors: hzzly
 * @LastEditTime: 2021-08-11 17:00:37
 * @Copyright: hzzly(hjingren@aliyun.com)
 * @Description: description
 */
var ts = require("typescript");
/**
 * Ts Interface 或 Type 类型定义转换为 json
 */
var TsToJson = /** @class */ (function () {
    function TsToJson() {
    }
    TsToJson.prototype._createProgram = function (fileNames, options) {
        var _this = this;
        this.interfaces = {};
        this.types = {};
        // 使用filename中的根文件名构建一个程序;
        var program = ts.createProgram(fileNames, options);
        // 获取检查器，我们将使用它来查找更多关于 ast 的信息
        this.checker = program.getTypeChecker();
        // 访问程序中的每个sourceFile
        for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
            var sourceFile = _a[_i];
            if (!sourceFile.isDeclarationFile) {
                // 遍历树以搜索 interface 和 type
                ts.forEachChild(sourceFile, function (node) { return _this._visitAst(node); });
            }
        }
    };
    /**
     * 访问查找导出的节点
     * @param node
     * @returns
     */
    TsToJson.prototype._visitAst = function (node) {
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
    };
    /**
     * 获取 Interface 类型 json 数据
     * @param node
     */
    TsToJson.prototype.generateInterfaceDeclaration = function (node) {
        var _this = this;
        var newNode = node;
        var symbol = this.checker.getSymbolAtLocation(newNode.name);
        var escapedName = symbol.escapedName;
        var _a = this._getDocs(symbol), _b = _a.name, name = _b === void 0 ? escapedName : _b, rest = __rest(_a, ["name"]);
        this.interfaces[name] = __assign(__assign({}, rest), { props: [] });
        symbol.members.forEach(function (member) {
            _this.interfaces[name].props.push(_this._serializeSymbol(member));
        });
    };
    /**
     * 获取 Type 类型 json 数据
     * @param node
     */
    TsToJson.prototype.generateTypeAliasDeclaration = function (node) {
        var type = this.checker.typeToString(this.checker.getTypeAtLocation(node), node, ts.TypeFormatFlags.InTypeAlias);
        var name = node.name.escapedText;
        this.types[name] = type;
    };
    /**
     * 将symbol序列化为json对象
     * @param symbol
     * @returns
     */
    TsToJson.prototype._serializeSymbol = function (symbol) {
        var _this = this;
        var docs = this._getDocs(symbol);
        var questionToken = symbol.valueDeclaration.questionToken;
        var type = this.checker.typeToString(this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration));
        var newType = type;
        if (type.indexOf("|") > 0) {
            newType = type
                .split("|")
                .map(function (item) {
                var hasType = _this.types[item.trim()];
                if (hasType) {
                    return " " + hasType + " ";
                }
                return item;
            })
                .join("|");
        }
        else if (this.types[type]) {
            newType = this.types[type];
        }
        return __assign({ name: symbol.getName(), required: !questionToken, type: newType }, docs);
    };
    /**
     * 获取jsDoc信息
     * @param symbol
     * @returns
     */
    TsToJson.prototype._getDocs = function (symbol) {
        var docs = {};
        if (Array.isArray(symbol.getJsDocTags(this.checker))) {
            symbol.getJsDocTags(this.checker).forEach(function (tag) {
                docs[tag.name] = tag.text && tag.text[0].text;
            });
        }
        return docs;
    };
    /**
     * 如果在文件外部可见，则为True，否则为false
     * @param node
     * @returns boolean
     */
    TsToJson.prototype._isNodeExported = function (node) {
        return ((ts.getCombinedModifierFlags(node) &
            ts.ModifierFlags.Export) !==
            0 ||
            (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile));
    };
    TsToJson.prototype.parse = function (fileNames, options) {
        if (options === void 0) { options = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
        }; }
        this._createProgram(fileNames, options);
        return this.interfaces;
    };
    return TsToJson;
}());
exports.default = TsToJson;
