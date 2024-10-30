import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(@InjectModel("User") private UserModel: Model<User>) { }

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

        return foundedUser;
    }

    private comparePasswords(password: string, hashedPassword: string) {
        return bcrypt.compareSync(password, hashedPassword);
    }
}
