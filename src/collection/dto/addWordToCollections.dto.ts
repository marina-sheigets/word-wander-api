import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsString } from "class-validator";


export class AddWordToCollectionsDto {
    @ApiProperty()
    @IsArray()
    @ArrayMinSize(1)
    collections: {
        name?: string,
        id?: string
    }[];

    @ApiProperty()
    @IsString()
    wordId: string;
}