import { Module } from '@nestjs/common';
import { SentryModule } from '@sentry/nestjs/setup';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DictionaryModule } from './dictionary/dictionary.module';
import { TrainingModule } from './training/training.module';
import { StatisticsModule } from './statistics/statistics.module';
import { CollectionModule } from './collection/collection.module';
import { DictionaryCollectionModule } from './dictionary-collection/dictionary-collection.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot(),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
    MongooseModule.forRoot(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dsplv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`),
    AuthModule,
    DictionaryModule,
    TrainingModule,
    StatisticsModule,
    CollectionModule,
    DictionaryCollectionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
