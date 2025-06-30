import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '@arbio/shared-core/dist/entities/User.entity';  // Importing User entity from built shared-core

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'arbio_db',
  synchronize: false,
  logging: true,
  entities: [User], // Using the shared User entity
  migrations: [__dirname + '/migrations/*{.ts,.js}'],  // Migrations are LOCAL to this service
});