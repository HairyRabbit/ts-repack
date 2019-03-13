import ts from "typescript"
import { identity } from "lodash"

interface ModulePathReplace {
  (modulePath: string, decl: ts.ImportDeclaration, context: ts.TransformationContext): string | null;
}

export default function transformer<T extends ts.Node>(replace: ModulePathReplace = identity): ts.TransformerFactory<T> {
  return context => {
    const visitor: ts.Visitor = node => {
      if (ts.isSourceFile(node))
        return ts.visitEachChild(node, visitor, context);
      else if (ts.isImportDeclaration(node)) {
        const decl = node;
        return ts.visitEachChild(node, node => {
          if (!ts.isStringLiteral(node))
            return node;
          const raw = node.text;
          const pathString = raw.replace(/[\'\"]/g, "");
          const replaced = replace(pathString, decl, context);
          if (null === replaced)
            return node;
          else if (replaced === pathString)
            return node;
          else
            return ts.createStringLiteral(replaced);
        }, context);
      }
      else
        return node;
    };
    return node => ts.visitNode(node, visitor);
  };
}
