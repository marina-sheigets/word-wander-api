import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class Collection extends Document {
    @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
    user: mongoose.Types.ObjectId;

    @Prop({ required: true })
    name: string;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);