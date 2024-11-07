import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Invalid email' })
    email: string;
}