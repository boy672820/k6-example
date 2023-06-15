import fs from 'fs';
import path from 'path';

const csvPath = path.join(__dirname, '../data/');

export function readCSV(filename: string): Array<string> {
  const file = fs.readFileSync(`${csvPath}${filename}`, 'utf8');
  const lines = file.split('\n');

  return lines;
}
