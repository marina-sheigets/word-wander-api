import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AddWordDto {
    @ApiProperty()
    @IsString()
    word: string;

    @ApiProperty()
    @IsString()
    translation: string;
}
