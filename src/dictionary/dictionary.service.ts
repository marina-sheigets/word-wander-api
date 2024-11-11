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
            { user: request.user.userId },
            { $set: { word, translation } },
            { upsert: true }
        );
    }
}
