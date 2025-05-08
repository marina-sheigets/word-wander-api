import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class EditWordDto {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    word: string;

    @ApiProperty()
    @IsString()
    translation: string;
}