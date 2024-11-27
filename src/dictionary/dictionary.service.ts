import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dictionary } from './schemas/dictionary.schema';
import { Model } from 'mongoose';
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
        const userId = request.user.userId;
        await this.DictionaryModel.updateOne(
            { user: userId, word },
            { $set: { translation } },
            { upsert: true }
        );

        await this.addWordToAllTrainings(userId, word);
    }

    public async getWords(request) {
        return this.DictionaryModel.find({ user: request.user.userId }).sort({ createdAt: -1 });
    }

    public deleteWord(request) {
        const { wordId } = request.query;
        return this.DictionaryModel.deleteOne({ _id: wordId, user: request.user.userId });
    }

    private async addWordToAllTrainings(userId: string, word: string) {
        const trainings = Object.values(TrainingName);

        for (const training of trainings) {
            await this.TrainingModel.updateOne(
                { user: userId, name: training },
                { $addToSet: { wordsIds: word } },
                { upsert: true }
            );
        }
    }
}
