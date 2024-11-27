import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dictionary, DictionarySchema } from './schemas/dictionary.schema';
import { Training, TrainingSchema } from 'src/training/schemas/training.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Dictionary.name,
        schema: DictionarySchema
      },
      {
        name: Training.name,
        schema: TrainingSchema
      }
    ])
  ],
  controllers: [DictionaryController],
  providers: [DictionaryService],
})
export class DictionaryModule { }
