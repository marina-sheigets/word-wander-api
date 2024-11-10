import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class RefreshToken extends Document {
    @Prop({ required: true })
    token: string;

    @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
    user: mongoose.Types.ObjectId;

    @Prop({ required: true, index: { expires: 0 } })
    expiresIn: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);