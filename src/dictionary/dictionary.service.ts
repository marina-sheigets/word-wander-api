import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dictionary } from './schemas/dictionary.schema';
import { Model } from 'mongoose';
import { AddWordDto } from './dto/add-word.dto';

@Injectable()
export class DictionaryService {
    constructor(
        @InjectModel(Dictionary.name) private DictionaryModel: Model<Dictionary>
    ) { }

    public async addWord(request, { translation, word }: AddWordDto) {
        await this.DictionaryModel.updateOne(
            { user: request.user.userId, word },
            { $set: { translation } },
            { upsert: true }
        );
    }

    public async getWords(request) {
        return this.DictionaryModel.find({ user: request.user.userId });
    }

    public deleteWord(request) {
        const { wordId } = request.query;
        return this.DictionaryModel.deleteOne({ _id: wordId, user: request.user.userId });
    }
}
