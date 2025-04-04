import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TrainingService } from './training.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { SetWordsDto } from './dto/set-words.dto';
import { TrainingName } from 'src/constants/TrainingName';
import { ApiQuery } from '@nestjs/swagger';
import { AddWordsForTrainingsDto } from './dto/add-words-for-trainings.dto';
import { DeleteWordsFromTrainingDto } from './dto/delete-words-from-trainings.dto';
import { UpdateRatioDto } from './dto/update-ratio.dto';

@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) { }

  @UseGuards(AuthGuard)
  @Post("set-words")
  async setWords(
    @Body() data: SetWordsDto,
    @Req() request: Request
  ) {
    return this.trainingService.setWords(data, request);
  }

  @ApiQuery({ name: 'trainingName', enum: TrainingName })
  @UseGuards(AuthGuard)
  @Get("get-words")
  async getWords(
    @Query("trainingName") trainingName: TrainingName,
    @Req() request: Request
  ) {
    return this.trainingService.getWords(request, trainingName);
  }

  @UseGuards(AuthGuard)
  @Get("get-amount-words-for-trainings")
  async getAmountWordsForTrainings(
    @Req() request: Request
  ) {
    return this.trainingService.getAmountWordsForTrainings(request);
  }

  @UseGuards(AuthGuard)
  @Post("add-words-for-trainings")
  async addWordsForTrainings(
    @Body() data: AddWordsForTrainingsDto,
    @Req() request: Request
  ) {
    return this.trainingService.addWordsForTrainings(data, request);
  }

  @UseGuards(AuthGuard)
  @Delete("delete-words-from-training")
  async deleteWordsFromTraining(
    @Body() data: DeleteWordsFromTrainingDto,
    @Req() request: Request
  ) {
    return this.trainingService.deleteWordsFromTraining(request, data);
  }

  @UseGuards(AuthGuard)
  @Post("finish-training")
  async updateRatio(
    @Body() data: UpdateRatioDto,
    @Req() request: Request
  ) {
    return this.trainingService.updateAccuracy(request, data);
  }
}
