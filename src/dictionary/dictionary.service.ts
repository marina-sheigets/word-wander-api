import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dictionary } from './schemas/dictionary.schema';
import mongoose, { Model } from 'mongoose';
import { AddWordDto } from './dto/add-word.dto';
import { TrainingName } from 'src/constants/TrainingName';
import { Training } from 'src/training/schemas/training.schema';
import { DictionaryCollection } from 'src/dictionary-collection/schemas/dictionary-collection.schema';
import { Collection } from 'src/collection/schemas/collection.schema';
import { EditWordDto } from './dto/edit-word.dto';

@Injectable()
export class DictionaryService {
    constructor(
        @InjectModel(Dictionary.name) private DictionaryModel: Model<Dictionary>,
        @InjectModel(Training.name) private TrainingModel: Model<Training>,
        @InjectModel(DictionaryCollection.name) private DictionaryCollectionModel: Model<DictionaryCollection>,
        @InjectModel(Collection.name) private CollectionModel: Model<Collection>
    ) { }

    public async addWord(request, { translation, word }: AddWordDto) {
        const userId = new mongoose.Types.ObjectId(request.user.userId);

        const trimmedTranslation = translation.toLowerCase().trim();
        const trimmedWord = word.toLowerCase().trim();

        const wordInDictionary = await this.DictionaryModel.findOneAndUpdate(
            { user: userId, word: trimmedWord },
            { $set: { translation: trimmedTranslation } },
            { upsert: true, new: true } // new: true returns the updated/created document
        );

        await this.addWordToAllTrainings(userId, wordInDictionary?._id as mongoose.Types.ObjectId);
        return wordInDictionary;
    }

    public async getWords(request) {
        try {
            const user = new mongoose.Types.ObjectId(request.user.userId);

            const dictionaryEntries = await this.DictionaryModel.find({
                user: user
            }).sort({ createdAt: -1 });

            const dictionaryIds = dictionaryEntries.map(entry => entry._id);
            const dictionaryCollections = await this.DictionaryCollectionModel.find({
                dictionary_id: { $in: dictionaryIds },
                user_id: user
            });

            const dictionaryToCollectionsMap = {};

            dictionaryCollections.forEach(dc => {
                if (!dictionaryToCollectionsMap[dc.dictionary_id.toString()]) {
                    dictionaryToCollectionsMap[dc.dictionary_id.toString()] = [];
                }
                dictionaryToCollectionsMap[dc.dictionary_id.toString()].push(dc.collection_id);
            });

            const collectionIds = dictionaryCollections.map(dc => dc.collection_id);

            const collections = await this.CollectionModel.find({
                _id: { $in: collectionIds }
            });

            const collectionMap = {};
            collections.forEach(collection => {
                collectionMap[collection._id.toString()] = collection;
            });

            const enrichedDictionaryEntries = dictionaryEntries.map(entry => {
                const plainEntry = entry.toObject ? entry.toObject() : JSON.parse(JSON.stringify(entry));

                plainEntry.collections = [];

                const collectionIds = dictionaryToCollectionsMap[entry._id.toString()] || [];

                collectionIds.forEach(collectionId => {
                    if (collectionMap[collectionId.toString()]) {
                        plainEntry.collections.push(collectionMap[collectionId.toString()]);
                    }
                });

                return plainEntry;
            });

            return enrichedDictionaryEntries;
        } catch (e) {
            Logger.error(e);
            throw (e);
        }
    }

    public deleteWord(request) {
        const { wordId } = request.query;

        this.removeWordFromAllTrainings(new mongoose.Types.ObjectId(request.user.userId), new mongoose.Types.ObjectId(wordId as string));

        return this.DictionaryModel.deleteOne({
            _id: new mongoose.Types.ObjectId(wordId),
            user: new mongoose.Types.ObjectId(request.user.userId)
        });
    }

    private async addWordToAllTrainings(userId: mongoose.Types.ObjectId, wordId: mongoose.Types.ObjectId) {
        const trainings = Object.values(TrainingName);

        for (const training of trainings) {
            await this.TrainingModel.updateOne(
                { user: userId, name: training },
                { $addToSet: { wordsIds: new mongoose.Types.ObjectId(wordId) } },
                { upsert: true }
            );
        }
    }

    public deleteAllWords(request, wordsIds: string[]) {
        for (const wordId of wordsIds) {
            this.removeWordFromAllTrainings(new mongoose.Types.ObjectId(request.user.userId), new mongoose.Types.ObjectId(wordId));
        }

        return this.DictionaryModel.deleteMany({ _id: { $in: wordsIds } });
    }

    private async removeWordFromAllTrainings(userId: mongoose.Types.ObjectId, wordId: mongoose.Types.ObjectId) {
        return this.TrainingModel.updateMany(
            { user: new mongoose.Types.ObjectId(userId) },
            { $pull: { wordsIds: new mongoose.Types.ObjectId(wordId) } }
        );
    }

    public async editWord(request, editWordData: EditWordDto) {
        try {
            const userId = new mongoose.Types.ObjectId(request.user.userId);

            const dictionaryObject = await this.DictionaryModel.findOne({
                _id: new mongoose.Types.ObjectId(editWordData.id),
                user: userId
            });
            if (!dictionaryObject) {
                throw new BadRequestException("Something went wrong");
            }

            dictionaryObject.word = editWordData.word;
            dictionaryObject.translation = editWordData.translation;

            return await dictionaryObject.save()
        } catch (e) {
            Logger.error(e);
            throw (e);
        }
    }
}
