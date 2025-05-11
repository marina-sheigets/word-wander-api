import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { CaptureErrors } from "src/decorators/catchErrors.decorator";
import { AuthGuard } from "src/guards/auth.guard";
import { AddCollectionDto } from "./dto/add-collection.dto";
import { CollectionService } from "./collection.service";
import { AddWordToCollectionsDto } from "./dto/addWordToCollections.dto";
import { EditCollectionDto } from "./dto/edit-collection.dto";


@Controller('collection')
export class CollectionController {
    constructor(
        private collectionService: CollectionService
    ) { }

    @UseGuards(AuthGuard)
    @Get('')
    @CaptureErrors()
    async getCollections(
        @Req() request
    ) {
        return this.collectionService.getCollections(request);
    }

    @UseGuards(AuthGuard)
    @Post('')
    @CaptureErrors()
    async addCollection(
        @Body() addCollectionData: AddCollectionDto,
        @Req() request
    ) {
        return this.collectionService.addCollection(request, addCollectionData);
    }

    @UseGuards(AuthGuard)
    @Post('add-word')
    @CaptureErrors()
    async addWordToCollections(
        @Body() addWordsToCollectionData: AddWordToCollectionsDto,
        @Req() request
    ) {
        return this.collectionService.addWordToCollections(request, addWordsToCollectionData);
    }

    @UseGuards(AuthGuard)
    @Put('edit-name')
    @CaptureErrors()
    async editCollectionName(
        @Body() editCollectionData: EditCollectionDto,
        @Req() request
    ) {
        return this.collectionService.editCollectionName(request, editCollectionData);
    }
}