import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


@Schema({ versionKey: false, timestamps: true })
export class Dictionary extends Document {
    @Prop({ required: true })
    word: string;

    @Prop({ required: true })
    translation: string;

    @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
    user: mongoose.Types.ObjectId;
}

export const DictionarySchema = SchemaFactory.createForClass(Dictionary);