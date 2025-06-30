import express from 'express';
import { AppDataSource } from './data-source';
import { User } from '@arbio/shared-core';

async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Reporting Service: Data Source has been initialized!');

  const app = express();
  const userRepository = AppDataSource.getRepository(User);

  app.get('/user-report', async (req, res) => {
    try {
      const userCount = await userRepository.count();
      const [firstUser] = await userRepository.find({
        order: { name: 'ASC' },
        take: 1,
      });
      
      res.json({
        totalUsers: userCount,
        firstAlphabeticalUser: firstUser,
      });

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: 'Error generating report', detail: message });
    }
  });
  
  const port = 3001;
  app.listen(port, () => {
    console.log(`Reporting Service running on http://localhost:${port}`);
  });
}

bootstrap().catch(error => console.log('Reporting Service Bootstrap error:', error));