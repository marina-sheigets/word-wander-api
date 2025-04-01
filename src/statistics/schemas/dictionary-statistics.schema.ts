import { Prop } from "@nestjs/mongoose";

export class DictionaryStatistics {
    @Prop({ required: true, default: 0 })
    total_pronounced_words: number;

    @Prop({ required: true, default: 0 })
    total_searched_words: number;
}
