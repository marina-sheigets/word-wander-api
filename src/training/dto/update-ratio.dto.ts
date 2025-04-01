import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber } from "class-validator";
import { TrainingName } from "src/constants/TrainingName";

export class UpdateRatioDto {
    @ApiProperty()
    @IsNumber()
    accuracyRate: number;

    @ApiProperty()
    @IsEnum(TrainingName)
    trainingName: TrainingName;
}