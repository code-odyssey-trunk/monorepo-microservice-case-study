import { DataSource } from 'typeorm';
import { User } from '@arbio/shared-core/dist/entities/User.entity';

export async function runUpdateRolesSeed(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ role: 'user' })
    .where('role IS NULL OR role = ""')
    .execute();
  console.log('Updated roles for all users.');
}