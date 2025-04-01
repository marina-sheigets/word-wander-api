import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { DictionaryStatistics } from "./dictionary-statistics.schema";
import { OtherStatistics } from "./other-statistics.schema";
import { TrainingsStatistics } from "./training-statistics.schema";


@Schema({ versionKey: false, timestamps: true })
export class Statistics extends Document {
    @Prop({ required: true })
    user: mongoose.Types.ObjectId;

    @Prop({ type: DictionaryStatistics, required: true })
    dictionary: DictionaryStatistics;

    @Prop({ type: OtherStatistics, required: true })
    other: OtherStatistics;

    @Prop({ type: TrainingsStatistics, required: true })
    trainings: TrainingsStatistics;
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);