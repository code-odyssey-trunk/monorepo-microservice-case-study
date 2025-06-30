import { AppDataSource } from '../data-source';

// Import individual seeds
import { runInitialUsersSeed } from './initial-users.seed';
import { runUpdateRolesSeed } from './update-roles.seed';

async function run() {
  await AppDataSource.initialize();

  // Run all seeds, or select based on CLI args
  const arg = process.argv[3];
  if (arg === 'update-roles') {
    console.log('Running update-roles seed');
    await runUpdateRolesSeed(AppDataSource);
  } else if (arg === 'initial-users') {
    console.log('Running initial-users seed');
    await runInitialUsersSeed(AppDataSource);
  } else {
    // Run all seeds
    console.log('Running all seeds');
    await runInitialUsersSeed(AppDataSource);
    await runUpdateRolesSeed(AppDataSource);
  }

  await AppDataSource.destroy();
}

run().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});