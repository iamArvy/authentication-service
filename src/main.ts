import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    url: process.env.GRPC_URL ?? '',
    // options: {
    //   package: 'auth',
    //   protoPath: 'proto/auth.proto',
    //   loader: {
    //     arrays: true,
    //     objects: true,
    //     includeDirs: ['proto'],
    //     keepCase: true,
    //     longs: String,
    //     defaults: true,
    //     oneofs: true,
    //     enums: String,
    //   },
    // },
  });
  await app.listen();
}
bootstrap();
