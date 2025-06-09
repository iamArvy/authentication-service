import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { Session, SessionSchema } from './session/session.schema';
import { Auth, AuthSchema } from './auth/auth.schema';
@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.DB_URL ||
        'mongodb://root:example@localhost:27017/auth?authSource=admin',
    ),
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
