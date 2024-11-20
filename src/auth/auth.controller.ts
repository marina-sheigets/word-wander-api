import { Body, Controller, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordData } from "./dto/reset-password.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('signup')
    async singUp(
        @Body() signupData: SignUpDto
    ) {
        return this.authService.signUp(signupData);
    }

    @Post('login')
    async login(
        @Body() loginData: LoginDto
    ) {
        return this.authService.login(loginData);
    }

    @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto);
    }

    @UseGuards(AuthGuard)
    @Put('change-password')
    async changePassword(
        @Body() changePasswordData: ChangePasswordDto,
        @Req() request
    ) {
        return await this.authService.changePassword(request, changePasswordData);
    }

    @Post('forgot-password')
    async forgotPassword(
        @Body() forgotPasswordData: ForgotPasswordDto
    ) {
        return this.authService.forgotPassword(forgotPasswordData);
    }

    @Put('reset-password')
    async resetPassword(
        @Body() resetPasswordData: ResetPasswordData
    ) {
        return this.authService.resetPassword(resetPasswordData);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Req() request) {
        return this.authService.logout(request);
    }
}
