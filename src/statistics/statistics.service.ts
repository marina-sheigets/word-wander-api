import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Statistics } from './schemas/statistics.schema';
import mongoose, { Model } from 'mongoose';
import { StatisticsPath } from 'src/constants/StatisticsPaths';
import { UpdateStatisticsDto } from './dto/update-statistics.dto';

@Injectable()
export class StatisticsService {

    constructor(
        @InjectModel(Statistics.name) private StatisticsModel: Model<Statistics>,
    ) {

    }

    public async getStatistics(request) {
        return this.StatisticsModel.find({ user: new mongoose.Types.ObjectId(request.user.userId) }).sort({ createdAt: -1 });
    }

    public async incrementField(request, updateData: UpdateStatisticsDto) {
        const userId = new mongoose.Types.ObjectId(request.user.userId);
        const { fieldPath } = updateData;

        switch (fieldPath) {
            case StatisticsPath.ADDED_WORDS:
            case StatisticsPath.TOTAL_DELETED_WORDS:
            case StatisticsPath.TOTAL_PRONOUNCED_WORDS:
            case StatisticsPath.TOTAL_SEARCHED_WORDS:
            case StatisticsPath.TOTAL_WORDS_IN_DICTIONARY:
            case StatisticsPath.LEARNED_WORDS:
            case StatisticsPath.SKIPPED_WORDS:
            case StatisticsPath.TOTAL_INTERRUPTED_TRAININGS:
                {
                    return this.StatisticsModel.findOneAndUpdate(
                        { user: userId },
                        { $inc: { [fieldPath]: 1 } },
                        {
                            new: true,
                            upsert: true
                        }
                    );
                };

            case StatisticsPath.ACCURACY_RATE: {
                const { accuracyRate } = updateData;
                return this.updateAccuracyRate(userId, accuracyRate);
            }

        }

    }

    private async updateAccuracyRate(userId: mongoose.Types.ObjectId, accuracyRate: number) {
        const stats = await this.StatisticsModel.findOne({ user: userId });

        const previousAccuracyRate = stats.trainings.accuracy_rate || 0;
        const previousTrainings = stats.trainings.trainings_completed || 0;

        const newTrainings = previousTrainings + 1;
        const newAccuracyRate = ((previousAccuracyRate * previousTrainings) + (accuracyRate * 100)) / newTrainings;

        return this.StatisticsModel.findOneAndUpdate(
            { user_id: userId },
            {
                $set: { [StatisticsPath.ACCURACY_RATE]: newAccuracyRate },
                // $inc: { "trainings.trainings_completed": 1 }
            },
            { new: true }
        );
    }


}
