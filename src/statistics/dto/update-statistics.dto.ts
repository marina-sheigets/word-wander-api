import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { StatisticsPath } from 'src/constants/StatisticsPaths';

export class UpdateStatisticsDto {
    @ApiProperty()
    @IsEnum(StatisticsPath, { message: 'Invalid fieldPath' })
    fieldPath: StatisticsPath;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    accuracyRate?: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    count?: number;
}
