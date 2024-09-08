import fs from 'fs';
import path from 'path';

export const getMarkdownFiles = (directory: string): string[] => {
  const dirents = fs.readdirSync(directory, { withFileTypes: true });
  const files = dirents.flatMap((dirent) => {
    const res = path.resolve(directory, dirent.name);
    return dirent.isDirectory() ? getMarkdownFiles(res) : res;
  });
  return files.map((file) => path.relative(process.cwd(), file));
};
