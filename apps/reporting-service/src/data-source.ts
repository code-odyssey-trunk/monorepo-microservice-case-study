import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '@arbio/shared-core'; 

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'arbio_db',
  synchronize: false,
  logging: ['query', 'error'],
  entities: [User],
  migrations: [], //Has no migrations
});