import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Training } from './schemas/training.schema';
import { Dictionary } from 'src/dictionary/schemas/dictionary.schema';
import { TrainingName } from 'src/constants/TrainingName';
import { AddWordsForTrainingsDto } from './dto/add-words-for-trainings.dto';
import { SetWordsDto } from './dto/set-words.dto';
import { DeleteWordsFromTrainingDto } from './dto/delete-words-from-trainings.dto';

@Injectable()
export class TrainingService {
    constructor(
        @InjectModel(Training.name) private TrainingModel: Model<Training>,
        @InjectModel(Dictionary.name) private DictionaryModel: Model<Dictionary>
    ) { }

    async setWords(data: SetWordsDto, request) {
        const userId = new mongoose.Types.ObjectId(request.user.userId);
        const { trainingName, wordsIds } = data;

        const training = await this.TrainingModel.findOne({ name: trainingName, user: userId })
            .populate('words')
            .where({ user: userId })
            .exec();


        const foundedWords = await this.DictionaryModel.find({ _id: { $in: wordsIds }, user: userId });

        if (!training) {
            const newTraining = new this.TrainingModel({
                name: trainingName,
                wordsIds: foundedWords,
                user: userId
            });

            await newTraining.save();
            return newTraining;
        }

        const uniqueWordIds = [
            ...new Set([
                ...training.wordsIds.map(word => word._id.toString()),
                ...foundedWords.map(word => word._id.toString())
            ])
        ].map(id => new mongoose.Types.ObjectId(id));

        training.wordsIds = await this.DictionaryModel.find({ _id: { $in: uniqueWordIds }, user: userId });
        await training.save();

        return training;
    }

    async getWords(request, trainingName: TrainingName) {
        const userId = new mongoose.Types.ObjectId(request.user.userId);

        const trainingData = await this.TrainingModel.findOne({ name: trainingName, user: userId });

        const wordsIds = trainingData ? trainingData?.wordsIds : [];

        const words = await this.DictionaryModel.find({ user: userId, _id: { $in: wordsIds } });

        let dictionaryData = await this.DictionaryModel.find({ user: userId });

        if (dictionaryData.length > 10) {
            dictionaryData = dictionaryData.slice(0, 10);
        }

        return { words, dictionaryData };
    }

    async getAmountWordsForTrainings(req) {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const trainingNames = Object.values(TrainingName);
        const result = await this.TrainingModel.find({ user: userId });

        const resultWithMissingTrainings = trainingNames.map((trainingName) => {
            const training = result.find((t) => t.name === trainingName);

            return {
                training: trainingName,
                amountOfWords: training ? training.wordsIds.length : 0,
            };
        });

        return resultWithMissingTrainings;
    }

    async addWordsForTrainings(data: AddWordsForTrainingsDto, request) {
        const user = new mongoose.Types.ObjectId(request.user.userId);
        const { wordsIds, trainings } = data;

        const wordObjectIds = wordsIds.map(id => new mongoose.Types.ObjectId(id));

        for (const trainingName of trainings) {
            await this.TrainingModel.findOneAndUpdate(
                { user, name: trainingName },
                { $addToSet: { wordsIds: { $each: wordObjectIds } } },
                { upsert: true }
            );
        }
    }


    async deleteWordsFromTraining(request, data: DeleteWordsFromTrainingDto) {
        const userId = new mongoose.Types.ObjectId(request.user.userId);
        const { wordsIds, trainingName } = data;

        const wordObjectIds = wordsIds.map(id => new mongoose.Types.ObjectId(id));

        return this.TrainingModel.updateOne(
            { user: userId, name: trainingName },
            { $pull: { wordsIds: { $in: wordObjectIds } } }
        );
    }

    async updateAccuracy(req, accuracyRate: number) {
        const user = new mongoose.Types.ObjectId(req.user.userId);

        const training = await this.TrainingModel.findOne({ user });
        const previousRate = training?.accuracyRate ?? 0;
        const attempts = training?.attempts ?? 0;

        const newRate = ((previousRate * attempts) + accuracyRate) / ((attempts + 1));

        return this.TrainingModel.findOneAndUpdate(
            { user },
            {
                $set: { accuracyRate: newRate },
                $inc: { attempts: 1 }
            },
            { new: true }
        );
    }
}
