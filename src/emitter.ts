import * as path from 'path'
import ts from 'typescript'

export default function emit(extension: string) {
  return (fileName: string, data: string) => {
    console.log(fileName)
    const ext: string = path.extname(fileName)
    return ts.sys.writeFile(
      '' === ext
        ? fileName 
        : replaceExtname(fileName, extension), 
      data
    )
  }
}

export function replaceExtname(filePath: string, ext: string): string {
  if(filePath.endsWith(`.d.ts`) || filePath.endsWith(`.d.ts.map`)) return filePath
  else if(filePath.endsWith(`.js`) || filePath.endsWith(`.js.map`)) return filePath.replace('.js', ext)
  return filePath.replace(path.extname(filePath), ext)
}
