import { IsNumber } from "class-validator";

export class UpdateRatioDto {
    @IsNumber()
    accuracyRate: number
}