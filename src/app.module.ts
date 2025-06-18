import { Module } from '@nestjs/common';
import { ControllerModule } from './controller/controller.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ControllerModule],
})
export class AppModule {}
