import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { AddCollectionDto } from "./dto/add-collection.dto";
import mongoose, { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Collection } from "./schemas/collection.schema";
import { AddWordToCollectionsDto } from "./dto/addWordToCollections.dto";
import { DictionaryCollection } from "src/dictionary-collection/schemas/dictionary-collection.schema";
import { EditCollectionDto } from "./dto/edit-collection.dto";

@Injectable()
export class CollectionService {

    constructor(
        @InjectModel(Collection.name) private CollectionModel: Model<Collection>,
        @InjectModel(DictionaryCollection.name) private DictionaryCollectionModel: Model<DictionaryCollection>,
    ) { }

    async getCollections(request) {
        return this.CollectionModel.find({ user: new mongoose.Types.ObjectId(request.user.userId) });
    }

    async addCollection(req, addCollectionData: AddCollectionDto) {
        const name = addCollectionData.name;
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const foundedCollection = await this.CollectionModel.findOne({ name: name, user: userId });

        if (foundedCollection) {
            throw new BadRequestException("Collection with such name already exists");
        }

        const newCollection = new this.CollectionModel({
            user: userId,
            name: name
        });

        return await newCollection.save();
    }

    async addWordToCollections(req, addWordsToCollectionData: AddWordToCollectionsDto) {
        try {
            const userId = new mongoose.Types.ObjectId(req.user.userId);
            const { collections, wordId } = addWordsToCollectionData;

            const newCollections = collections.filter(c => !c.id);
            const existingCollections = collections.filter((c) => c.id);

            const createdCollectionsIds = [];

            for (const collection of newCollections) {
                const result = await this.addCollection(req, { name: collection.name });
                createdCollectionsIds.push(result);
            }

            const allCollectionsIds = [
                ...existingCollections.map(c => c.id),
                ...createdCollectionsIds
            ];

            const createOperations = allCollectionsIds.map(collectionId => (
                this.DictionaryCollectionModel.create({
                    user_id: userId,
                    collection_id: new mongoose.Types.ObjectId(collectionId),
                    dictionary_id: new mongoose.Types.ObjectId(wordId)
                })
            ));

            await Promise.all(createOperations);

            return;
        } catch (e) {
            Logger.log(e);
            throw (e);
        }
    }

    async editCollectionName(req, editCollectionDto: EditCollectionDto) {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const collectionId = new mongoose.Types.ObjectId(editCollectionDto.collectionId);

        const foundedCollection = await this.CollectionModel.findOne({ user: userId, _id: collectionId });

        if (!foundedCollection) {
            throw new BadRequestException();
        }

        foundedCollection.name = editCollectionDto.name;

        return await foundedCollection.save();
    }
}