import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";

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
}
