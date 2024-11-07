import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class ResetToken extends Document {
    @Prop({ required: true })
    token: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: mongoose.Types.ObjectId;

    @Prop({ required: true })
    expiresIn: Date;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);