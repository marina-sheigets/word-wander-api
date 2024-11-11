import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Training, TrainingSchema } from './schemas/training.schema';
import { Dictionary, DictionarySchema } from 'src/dictionary/schemas/dictionary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Training.name,
        schema: TrainingSchema
      },
      {
        name: Dictionary.name,
        schema: DictionarySchema
      }
    ])
  ],
  controllers: [TrainingController],
  providers: [TrainingService],
})
export class TrainingModule { }