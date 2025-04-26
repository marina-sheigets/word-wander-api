import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateStatisticsDto } from './dto/update-statistics.dto';
import { CaptureErrors } from 'src/decorators/catchErrors.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) { }

  @UseGuards(AuthGuard)
  @Get('')
  @CaptureErrors()
  async getStatistics(
    @Req() request
  ) {
    return this.statisticsService.getStatistics(request);
  }

  @UseGuards(AuthGuard)
  @Post('')
  @CaptureErrors()
  async updateField(
    @Req() request,
    @Body() updateDto: UpdateStatisticsDto
  ) {
    return this.statisticsService.incrementField(request, updateDto);
  }
}
