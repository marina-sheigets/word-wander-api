import { BadRequestException, Injectable } from "@nestjs/common";
import { AddCollectionDto } from "./dto/add-collection.dto";
import mongoose, { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Collection } from "./schemas/collection.schema";

@Injectable()
export class CollectionService {

    constructor(
        @InjectModel(Collection.name) private CollectionModel: Model<Collection>,
    ) { }

    async getCollections(request) {
        return this.CollectionModel.find({ user: new mongoose.Types.ObjectId(request.user.userId) });
    }

    async addCollection(req, addCollectionData: AddCollectionDto) {
        const name = addCollectionData.name;
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const foundedCollection = await this.CollectionModel.findOne({ name: name, user: userId });

        if (foundedCollection) {
            throw new BadRequestException("Collection with such name already exists");
        }

        const newCollection = new this.CollectionModel({
            user: userId,
            name: name
        });

        return await newCollection.save();
    }
}