import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class AddCollectionDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(25)
    name: string;
}