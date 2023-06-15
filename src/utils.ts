import fs from 'fs';

export function getDateNumsBetween(b: Date) {
  const a = new Date(); // new instance to avoid side effects.
  return ((a.getFullYear() % 100) * 100 + a.getMonth() + 1) * 100 + a.getDate();
}

export const writeFile = (dir: string, data: string) =>
  new Promise((resolve, reject) => {
    fs.writeFile(dir, data, (err) => {
      if (err) reject(err);

      resolve(data);
    });
  });
