import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TrainingService } from './training.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { SetWordsDto } from './dto/set-words.dto';
import { TrainingName } from 'src/constants/TrainingName';
import { ApiQuery } from '@nestjs/swagger';

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
}
