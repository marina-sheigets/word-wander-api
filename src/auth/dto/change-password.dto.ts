import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MinLength } from "class-validator";


export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    oldPassword: string;

    @ApiProperty()
    @IsString()
    @MinLength(6, { message: 'New password must be at least 6 characters long' })
    @Matches(/^(?=.*[0-9])/, { message: 'New password must contain at least one number' })
    newPassword: string;
}