import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TrainingService } from './training.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { SetWordsDto } from './dto/set-words.dto';

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
}
