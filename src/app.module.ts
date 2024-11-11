import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DictionaryModule } from './dictionary/dictionary.module';
import { TrainingModule } from './training/training.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
    MongooseModule.forRoot(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dsplv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`),
    AuthModule,
    DictionaryModule,
    TrainingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
