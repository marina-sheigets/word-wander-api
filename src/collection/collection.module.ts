import { Module } from '@nestjs/common';
import { Collection, CollectionSchema } from './schemas/collection.schema';
import { CollectionController } from './collection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionService } from './collection.service';
import { DictionaryCollection, DictionaryCollectionSchema } from 'src/dictionary-collection/schemas/dictionary-collection.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Collection.name,
                schema: CollectionSchema
            },
        ]),
        MongooseModule.forFeature([
            {
                name: DictionaryCollection.name,
                schema: DictionaryCollectionSchema
            },
        ])
    ],
    controllers: [CollectionController],
    providers: [CollectionService],
})
export class CollectionModule { }
