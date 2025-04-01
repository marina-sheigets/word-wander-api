import { IsEnum, IsString } from 'class-validator';
import { StatisticsPath } from 'src/constants/StatisticsPaths';

export class UpdateStatisticsDto {
    @IsEnum(StatisticsPath, { message: 'Invalid fieldPath' })
    fieldPath: StatisticsPath;

    @IsString()
    accuracyRate?: number;
}
