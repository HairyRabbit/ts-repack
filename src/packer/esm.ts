import ts from "typescript"
import * as path from "path"
import * as url from "url"
import transform from "../transformer"

export default async function packCommonJS(rootNames: string[], config: ts.CompilerOptions): Promise<void> {
    const overridedConfig = overrideConfig(config);
    const program = ts.createProgram(rootNames, overridedConfig);
    program.emit(undefined, undefined, undefined, undefined, {
        after: [transform(replace)]
    });
}

function overrideConfig(config: ts.CompilerOptions): ts.CompilerOptions {
    config.target = ts.ScriptTarget.ES2015;
    config.module = ts.ModuleKind.ESNext;
    config.outDir = "__MODULE_ESM__";
    return config;
}

function replace(str: string, decl: ts.ImportDeclaration): string | null {
    if (isModule(str))
        return null;
    const src: ts.SourceFile = decl.getSourceFile();
    if (undefined === src)
        return null;
    const fileName: string = src.fileName;
    /** @todos name mapper */
    console.log(fileName, str);
    if (undefined === require.extensions[".ts"])
        require.extensions[".ts"] = require.extensions[".js"];
    const fileDirectory: string = path.dirname(fileName);
    const absoulted = require.resolve(path.resolve(fileDirectory, str));
    const relatived = formatRelativePath(path.relative(fileDirectory, absoulted));
    return replaceExtname(relatived, ".js");
}
function isModule(str: string): boolean {
    return !/[\/\\]/g.test(str);
}
function formatRelativePath(filePath: string) {
    const formatten = filePath.split(path.sep).join(path.posix.sep);
    return url.format(formatten.startsWith("../") ? formatten : "./" + formatten);
}
function replaceExtname(filePath: string, ext: string): string {
    return filePath.replace(path.extname(filePath), ext);
}
