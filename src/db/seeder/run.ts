import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { SuperuserSeeder } from './superuser.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(SuperuserSeeder);
  // const type = process.argv[2];
  // if (type === 'superuser') {
  //   await seeder.seedSuperuser();
  // }
  await seeder.seedSuperuser();
  await app.close();
}
bootstrap();
