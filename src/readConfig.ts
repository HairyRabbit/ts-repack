import ts from "typescript"
import * as fs from "fs"
import * as path from "path"
import { merge } from "lodash"

const CONFIG_NOT_EXISTS: Error = new Error(`config file not found`);
const CONFIG_READ_FAILED: (msg: string) => Error = msg => new Error(`config file read failed: \n${msg}`);

export default function readConfig() {
    const configFilePath = ts.findConfigFile(process.cwd(), fs.existsSync);
    if (undefined === configFilePath)
        throw CONFIG_NOT_EXISTS;
    const result = combineParentConfig(configFilePath, readConfigContent(configFilePath));
    return ts.parseJsonConfigFileContent(result, ts.sys, result.baseUrl || "./", undefined, configFilePath);
}
function readConfigContent(root: string): any {
    const { config, error } = ts.readConfigFile(root, content => fs.readFileSync(content, "utf-8"));
    if (undefined !== error)
        throw CONFIG_READ_FAILED(combineErrorMessageText(error.messageText).join("\n"));
    return config;
}
function combineParentConfig(root: string, config: any): typeof config {
    if (!config.extends)
        return config;
    const parentFilePath: string = path.resolve(root, config.extends);
    const parentConfig = readConfigContent(parentFilePath);
    delete config.extends;
    const combinedConfig = merge({}, parentConfig, config); //{ ...parentConfig, ...config }
    return combineParentConfig(parentFilePath, combinedConfig);
}
function combineErrorMessageText(msg: string | ts.DiagnosticMessageChain): string[] {
    if ("string" === typeof msg)
        return [msg];
    let acc = [];
    while (msg.next)
        acc.push(msg.messageText);
    return acc;
}
