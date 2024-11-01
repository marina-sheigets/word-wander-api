import {
    BadRequestException,
    Injectable,
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

@Injectable()
export class AuthService {
    readonly REFRESH_TOKEN_EXPIRATION_TIME = 60; // 60 days

    constructor(
        private jwt: JwtService,
        @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
        @InjectModel(User.name) private UserModel: Model<User>
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

}
