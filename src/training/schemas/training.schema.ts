import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import mongoose, { Document } from "mongoose";
import { TrainingName } from "src/constants/TrainingName";
import { Dictionary } from "src/dictionary/schemas/dictionary.schema";

@Schema({ timestamps: true, versionKey: false })
export class Training extends Document {
    @IsString()
    @Prop({ required: true, enum: TrainingName })
    name: TrainingName;

    @Prop({ required: true, type: [{ type: mongoose.Types.ObjectId, ref: "Dictionary" }] })
    wordsIds: Dictionary[];

    @Prop({ required: true, type: mongoose.Types.ObjectId, ref: "User" })
    user: mongoose.Types.ObjectId;
}

export const TrainingSchema = SchemaFactory.createForClass(Training);