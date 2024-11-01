import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { RefreshTokenSchema } from './schemas/refresh-token.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema
            },
            {
                name: "RefreshToken",
                schema: RefreshTokenSchema
            }
        ])
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }
