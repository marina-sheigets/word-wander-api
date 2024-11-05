import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { RefreshToken } from "./schemas/refresh-token.schema";
import { v4 as uuidv4 } from "uuid";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { nanoid } from "nanoid";
import { ResetToken } from "./schemas/reset-tokens.schema";
import { MailService } from "src/services/mail.service";

@Injectable()
export class AuthService {
    readonly REFRESH_TOKEN_EXPIRATION_TIME = 60; // 60 days

    constructor(
        private jwt: JwtService,
        private mailService: MailService,
        @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(ResetToken.name) private ResetTokenModel: Model<ResetToken>
    ) { }

    async signUp(signupData: any) {
        const foundedUser = await this.findUserByEmail(signupData.email);

        if (foundedUser) {
            throw new BadRequestException("User already exists");
        }

        const hashedPassword = this.hashPassword(signupData.password);

        const createdUser = this.createUser(signupData.email, hashedPassword);

        return createdUser;
    }

    private async findUserByEmail(email: string) {
        return this.UserModel.findOne({ email });
    }

    private hashPassword(password: string) {
        return bcrypt.hashSync(password, 10);
    }

    private async createUser(email: string, password: string) {
        const user = await this.UserModel.create({
            email,
            password,
        });

        return user.save();
    }

    async login(loginData: any) {
        const foundedUser = await this.findUserByEmail(loginData.email);

        if (!foundedUser) {
            throw new UnauthorizedException("Wrong credentials");
        }

        const isPasswordValid = this.comparePasswords(
            loginData.password,
            foundedUser.password
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException("Wrong credentials");
        }

        return await this.generateUserTokens(foundedUser._id as mongoose.Types.ObjectId);
    }

    private comparePasswords(password: string, hashedPassword: string) {
        return bcrypt.compareSync(password, hashedPassword);
    }

    private async generateUserTokens(userId: mongoose.Types.ObjectId) {
        const accessToken = this.jwt.sign({ userId }, { expiresIn: '15m' }); // secret key was set in app.module.ts
        const refreshToken = uuidv4();

        await this.storeRefreshToken(userId, refreshToken);

        return { accessToken, refreshToken };
    }

    async storeRefreshToken(userId: mongoose.Types.ObjectId, refreshToken: string) {
        const expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() + this.REFRESH_TOKEN_EXPIRATION_TIME);

        // unsure that the user has only one refresh token
        await this.RefreshTokenModel.updateOne(
            { user: userId },
            { $set: { token: refreshToken, expiresIn } },
            { upsert: true }
        );

    }

    async refreshToken({ token }: RefreshTokenDto) {
        const refreshToken = await this.RefreshTokenModel.findOne({
            token
        });

        if (!refreshToken || refreshToken.expiresIn < new Date()) {
            throw new UnauthorizedException();
        }

        // we should delete the old refresh token and generate a new one
        await this.RefreshTokenModel.deleteOne({ _id: refreshToken._id });

        return await this.generateUserTokens(refreshToken.user);
    }

    async changePassword(req, { newPassword, oldPassword }: ChangePasswordDto) {
        const user = await this.UserModel.findById(req.user.userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const arePasswordsEqual = this.comparePasswords(oldPassword, user.password);

        if (!arePasswordsEqual) {
            throw new UnauthorizedException("Wrong credentials");
        }

        const newHashedPassword = this.hashPassword(newPassword);

        user.password = newHashedPassword;
        await user.save();
    }

    async forgotPassword({ email }: ForgotPasswordDto) {
        const user = await this.findUserByEmail(email);

        // no need to show the user that the email is not found because of security reasons

        if (user) {
            const expiresIn = new Date();
            expiresIn.setHours(expiresIn.getHours() + 1);

            const resetToken = nanoid(64);
            await this.ResetTokenModel.create({
                token: resetToken,
                user: user._id,
                expiresIn
            });

            this.mailService.sendPasswordResetEmail(email, resetToken);
        }

    }
}
