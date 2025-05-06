import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class DictionaryCollection extends Document {
    @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
    user_id: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'Collection' })
    collection_id: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'Dictionary' })
    dictionary_id: string;
}

export const DictionaryCollectionSchema = SchemaFactory.createForClass(DictionaryCollection);