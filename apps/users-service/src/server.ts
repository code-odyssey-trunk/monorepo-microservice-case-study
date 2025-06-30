import express, { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppDataSource } from './data-source';
import { CreateUserDto, User } from '@arbio/shared-core'; 

async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Users Service: Data Source has been initialized!');

  const app = express();
  app.use(express.json());
  const userRepository = AppDataSource.getRepository(User);

  app.post('/users', async (req: Request, res: Response): Promise<void> => {
    const createUserDto = plainToInstance(CreateUserDto, req.body);
    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }
    
    try {
      const user = userRepository.create(createUserDto);
      await userRepository.save(user);
      res.status(201).json(user);
    } catch(error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: 'Error creating user', detail: message });
    }
  });

  app.get('/users', async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await userRepository.find();
      res.json(users);
    } catch(error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: 'Error fetching users', detail: message });
    }
  });
  
  const port = 3000;
  app.listen(port, () => {
    console.log(`Service A running on http://localhost:${port}`);
  });
}

bootstrap().catch(error => console.log('Bootstrap error:', error));