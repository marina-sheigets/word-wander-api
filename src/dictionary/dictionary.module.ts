import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dictionary, DictionarySchema } from './schemas/dictionary.schema';
import { Training, TrainingSchema } from 'src/training/schemas/training.schema';
import { DictionaryCollection, DictionaryCollectionSchema } from 'src/dictionary-collection/schemas/dictionary-collection.schema';
import { Collection, CollectionSchema } from 'src/collection/schemas/collection.schema';

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
      },
      {
        name: DictionaryCollection.name,
        schema: DictionaryCollectionSchema
      },
      {
        name: Collection.name,
        schema: CollectionSchema
      }
    ])
  ],
  controllers: [DictionaryController],
  providers: [DictionaryService],
})
export class DictionaryModule { }
