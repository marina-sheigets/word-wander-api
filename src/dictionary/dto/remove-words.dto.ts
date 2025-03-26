import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, ArrayUnique, IsArray } from "class-validator";

export class RemovesWordsDto {
    @ApiProperty()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayUnique()
    wordsIds: string[];
}
