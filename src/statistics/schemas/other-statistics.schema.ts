import { Prop } from "@nestjs/mongoose";

export class OtherStatistics {
    @Prop({ required: true, default: 0 })
    added_words: number;

    @Prop({ required: true, default: 0 })
    total_words_in_dictionary: number;

    @Prop({ required: true, default: 0 })
    total_deleted_words: number;
}