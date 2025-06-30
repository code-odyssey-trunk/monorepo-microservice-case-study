import { DataSource } from 'typeorm';
import { User } from '@arbio/shared-core/dist/entities/User.entity';

export async function runInitialUsersSeed(dataSource: DataSource) {
  console.log('Seeding database...');

  const userRepository = dataSource.getRepository(User);

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
}