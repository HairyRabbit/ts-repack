import ts from "typescript"
import { Result, isErr } from "util-extra/container/result"

interface ModulePathReplace {
  (modulePath: string, decl: ts.ImportDeclaration, context: ts.TransformationContext): Result<string, Error>
}

export const NOTRANSFORM: string = 'NOTRANSFORM'

export default function transformer<T extends ts.Node>(replace: ModulePathReplace): ts.TransformerFactory<T> {
  return context => {
    const visitor: ts.Visitor = node => {
      if(undefined === replace) return node
      if (ts.isSourceFile(node)) return ts.visitEachChild(node, visitor, context)
      else if (ts.isImportDeclaration(node)) {        
        const decl = node
        return ts.visitEachChild(node, node => {
          if (!ts.isStringLiteral(node)) return node
          const raw = node.text
          const pathString = raw.replace(/[\'\"]/g, "")
          const replaced = replace(pathString, decl, context)
          if(isErr(replaced)) throw replaced.unwrapErr()
          const replacedStr = replaced.unwrap()
          if(replacedStr === pathString || replacedStr === NOTRANSFORM) return node
          return ts.createStringLiteral(replacedStr)
        }, context)
      }
      else return node
    }
    return node => ts.visitNode(node, visitor);
  }
}
