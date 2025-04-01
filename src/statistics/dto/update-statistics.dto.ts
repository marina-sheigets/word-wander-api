import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatisticsPath } from 'src/constants/StatisticsPaths';

export class UpdateStatisticsDto {
    @ApiProperty()
    @IsEnum(StatisticsPath, { message: 'Invalid fieldPath' })
    fieldPath: StatisticsPath;

    @ApiProperty()
    @IsString()
    @IsOptional()
    accuracyRate?: number;
}
