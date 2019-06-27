export default function overrideOutDir(outDir: string | undefined, directory: string): string {
  return (outDir || 'dist') + '/' + directory
}
