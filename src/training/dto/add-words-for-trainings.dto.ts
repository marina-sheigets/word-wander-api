import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, ArrayUnique, IsArray } from "class-validator";
import { TrainingName } from "src/constants/TrainingName";

export class AddWordsForTrainingsDto {
    @IsArray()
    @ArrayMinSize(1)
    @ArrayUnique()
    wordsIds: string[];

    @ApiProperty({ enum: TrainingName })
    @IsArray()
    @ArrayMinSize(1)
    trainings: TrainingName[];
}