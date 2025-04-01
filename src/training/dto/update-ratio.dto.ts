import { IsEnum, IsNumber } from "class-validator";
import { TrainingName } from "src/constants/TrainingName";

export class UpdateRatioDto {
    @IsNumber()
    accuracyRate: number;

    @IsEnum(TrainingName)
    trainingName: TrainingName;
}