import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { logger } from '../../src/common/logger/logger.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export function getDatabaseDir(folderName) {
  return path.resolve(currentDir, `../../database/${folderName}`);
}

export async function loadDatabaseModules(folderName) {
  const directory = getDatabaseDir(folderName);
  const entries = await fs.readdir(directory);
  const files = entries.filter((entry) => entry.endsWith('.js')).sort();
  const modules = [];

  for (const fileName of files) {
    const fullPath = path.join(directory, fileName);
    const module = await import(pathToFileURL(fullPath).href);

    modules.push({
      fileName,
      ...module
    });
  }

  return modules;
}

export function logStepStart(kind, name) {
  logger.info(`[db:${kind}] start ${name}`);
}

export function logStepDone(kind, name) {
  logger.info(`[db:${kind}] done ${name}`);
}
