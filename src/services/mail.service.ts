import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {

        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'richmond.mante92@ethereal.email',
                pass: 'G1Upc74XxxA7p86eNb'
            }
        });
    }

    public async sendPasswordResetEmail(email: string, token: string) {
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;

        const mailOptions = {
            from: 'WordWander API',
            to: email,
            subject: 'Password Reset',
            text: `Click on the link to reset your password: ${resetLink}`,
        }

        return this.transporter.sendMail(mailOptions);
    }
}
