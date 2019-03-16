export default function isModule(str: string): boolean {
  return !/\.\.?(\/|\\)/g.test(str)
}
