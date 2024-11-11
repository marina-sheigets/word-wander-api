import { Injectable, Logger } from '@nestjs/common';
import { SetWordsDto } from './dto/set-words.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Training } from './schemas/training.schema';
import { Dictionary } from 'src/dictionary/schemas/dictionary.schema';

@Injectable()
export class TrainingService {
    constructor(
        @InjectModel(Training.name) private TrainingModel: Model<Training>,
        @InjectModel(Dictionary.name) private DictionaryModel: Model<Dictionary>
    ) { }

    async setWords(data: SetWordsDto, request) {
        const userId = request.user.userId;
        const { trainingName, wordsIds } = data;

        const training = await this.TrainingModel.findOne({ name: trainingName, user: userId })
            .populate('words')
            .where({ user: userId })
            .exec();

        Logger.log(training);

        const foundedWords = await this.DictionaryModel.find({ _id: { $in: wordsIds } });

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

        training.wordsIds = await this.DictionaryModel.find({ _id: { $in: uniqueWordIds } });
        await training.save();

        return training;
    }
}
