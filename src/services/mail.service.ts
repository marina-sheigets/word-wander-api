import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {

        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD
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

        return await this.transporter.sendMail(mailOptions);
    }
}
