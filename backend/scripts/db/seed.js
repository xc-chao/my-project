import { closePool, ensureDatabaseExists, getPool } from '../../src/config/db.js';
import { logStepDone, logStepStart, loadDatabaseModules } from './utils.js';

async function runSeeds() {
  await ensureDatabaseExists();

  const seeds = await loadDatabaseModules('seeds');

  for (const seedModule of seeds) {
    const seedName = seedModule.name || seedModule.fileName;

    if (typeof seedModule.seed !== 'function') {
      throw new Error(`Seed ${seedModule.fileName} is missing exported seed()`);
    }

    logStepStart('seed', seedName);
    await seedModule.seed({ pool: getPool() });
    logStepDone('seed', seedName);
  }
}

runSeeds()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
