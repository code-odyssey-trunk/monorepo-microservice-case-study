import { AppDataSource } from './data-source';
import { User } from '@arbio/shared-core';

async function seed() {
  await AppDataSource.initialize();
  console.log('Seeding database...');

  const userRepository = AppDataSource.getRepository(User);

  const users = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
  ];

  for (const userData of users) {
    const user = userRepository.create(userData);
    await userRepository.save(user);
    console.log(`Saved user ${user.name}`);
  }

  console.log('Seeding complete!');
  await AppDataSource.destroy();
}

seed().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});