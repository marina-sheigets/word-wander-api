import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dictionary } from './schemas/dictionary.schema';
import mongoose, { Model } from 'mongoose';
import { AddWordDto } from './dto/add-word.dto';
import { TrainingName } from 'src/constants/TrainingName';
import { Training } from 'src/training/schemas/training.schema';

@Injectable()
export class DictionaryService {
    constructor(
        @InjectModel(Dictionary.name) private DictionaryModel: Model<Dictionary>,
        @InjectModel(Training.name) private TrainingModel: Model<Training>
    ) { }

    public async addWord(request, { translation, word }: AddWordDto) {
        const userId = new mongoose.Types.ObjectId(request.user.userId);

        const wordInDictionary = await this.DictionaryModel.findOne({ user: userId, word });

        await this.DictionaryModel.updateOne(
            { user: userId, word },
            { $set: { translation } },
            { upsert: true }
        );

        await this.addWordToAllTrainings(userId, wordInDictionary?._id as mongoose.Types.ObjectId);
    }

    public async getWords(request) {
        return this.DictionaryModel.find({ user: new mongoose.Types.ObjectId(request.user.userId) }).sort({ createdAt: -1 });
    }

    public deleteWord(request) {
        const { wordId } = request.query;
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
}
