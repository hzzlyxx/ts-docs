import { Interfaces, DocsType } from "../TsToJson";
/**
 * json 转换为 markdown
 */
declare class JsonToMarkdown {
    commentToMarkDown(json: Interfaces): string;
    renderMarkDown(name: string, data: Interfaces["name"]): string;
    renderProp(prop: DocsType): string;
}
export default JsonToMarkdown;
