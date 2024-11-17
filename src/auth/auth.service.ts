import {
    BadRequestException,
    Injectable,
    Logger,
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

        const registrationDate = new Date();
        const hashedPassword = this.hashPassword(signupData.password);

        const createdUser = await this.createUser(signupData.email, hashedPassword, registrationDate);

        return await this.generateUserTokens(createdUser)
    }

    private async findUserByEmail(email: string) {
        return this.UserModel.findOne({ email });
    }

    private hashPassword(password: string) {
        return bcrypt.hashSync(password, 10);
    }

    private async createUser(email: string, password: string, registrationDate: Date) {
        const user = await this.UserModel.create({
            email,
            password,
            registrationDate
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

        return await this.generateUserTokens(foundedUser);
    }

    private comparePasswords(password: string, hashedPassword: string) {
        return bcrypt.compareSync(password, hashedPassword);
    }

    private async generateUserTokens(user: User) {
        const accessToken = this.jwt.sign(
            {
                userId: user._id,
                email: user.email,
                registrationDate: user.registrationDate
            },
            { expiresIn: '15m' }); // secret key was set in app.module.ts

        const refreshToken = uuidv4();

        await this.storeRefreshToken(user._id as mongoose.Types.ObjectId, refreshToken);

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

        const user = await this.UserModel.findById(refreshToken.user);

        return await this.generateUserTokens(user);
    }

    async changePassword(req, { newPassword, oldPassword }: ChangePasswordDto) {
        const user = await this.UserModel.findById(req.user.userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const arePasswordsEqual = this.comparePasswords(oldPassword, user.password);

        if (!arePasswordsEqual) {
            throw new BadRequestException("Wrong credentials");
        }

        const newHashedPassword = this.hashPassword(newPassword);

        user.password = newHashedPassword;
        await user.save();
    }

    async forgotPassword({ email }: ForgotPasswordDto) {
        const user = await this.findUserByEmail(email);

        // no need to show the user that the email is not found because of security reasons

        if (user) {
            const expiresIn = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

            const resetToken = nanoid(64);

            await this.ResetTokenModel.updateOne(
                { user: user._id },
                { $set: { token: resetToken, expiresIn } },
                { upsert: true }
            );

            try {
                await this.mailService.sendPasswordResetEmail(email, resetToken);
            } catch (e) {
                Logger.error(e);
            }
        }

        return { message: "If the email exists, the reset link has been sent" };
    }

    async resetPassword({ newPassword, resetToken }: any) {
        const foundedToken = await this.findResetToken(resetToken);

        if (!foundedToken) {
            throw new UnauthorizedException("Invalid link");
        }

        const user = await this.UserModel.findById(foundedToken.user);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const newHashedPassword = this.hashPassword(newPassword);
        user.password = newHashedPassword;
        await user.save();

        return { message: "Password has been changed" };
    }

    async findResetToken(token: string) {
        return this.ResetTokenModel.findOne({
            token,
            expiresIn: { $gte: new Date() }
        });
    }
}
