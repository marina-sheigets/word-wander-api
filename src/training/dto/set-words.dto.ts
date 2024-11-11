import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, ArrayUnique, IsArray, IsEnum } from "class-validator";
import { TrainingName } from "src/constants/TrainingName";
import { Dictionary } from "src/dictionary/schemas/dictionary.schema";

export class SetWordsDto {
    @ApiProperty({ type: [Dictionary] })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayUnique()
    wordsIds: Dictionary[];

    @ApiProperty({ enum: TrainingName })
    @IsEnum(TrainingName)
    trainingName: TrainingName;
}