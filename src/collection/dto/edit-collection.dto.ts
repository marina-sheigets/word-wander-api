import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class EditCollectionDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(25)
    name: string;

    @ApiProperty()
    @IsString()
    collectionId: string;
}