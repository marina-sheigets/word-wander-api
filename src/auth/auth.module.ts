import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { ResetToken, ResetTokenSchema } from './schemas/reset-tokens.schema';
import { MailService } from 'src/services/mail.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            },
            {
                name: RefreshToken.name,
                schema: RefreshTokenSchema
            },
            {
                name: ResetToken.name,
                schema: ResetTokenSchema
            }
        ])
    ],
    controllers: [AuthController],
    providers: [AuthService, MailService]
})
export class AuthModule { }
