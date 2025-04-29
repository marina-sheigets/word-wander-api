import { Module } from '@nestjs/common';
import { Collection, CollectionSchema } from './schemas/collection.schema';
import { CollectionController } from './collection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionService } from './collection.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Collection.name,
                schema: CollectionSchema
            },
        ])
    ],
    controllers: [CollectionController],
    providers: [CollectionService],
})
export class CollectionModule { }
