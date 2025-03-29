import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, ArrayUnique, IsArray, IsString } from "class-validator";
import { TrainingName } from "src/constants/TrainingName";

export class DeleteWordsFromTrainingDto {
    @ApiProperty()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayUnique()
    wordsIds: string[];

    @ApiProperty()
    @IsString()
    trainingName: TrainingName

}