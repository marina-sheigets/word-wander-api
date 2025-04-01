import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Statistics, StatisticsSchema } from './schemas/statistics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Statistics.name,
        schema: StatisticsSchema
      },

    ])
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule { }
