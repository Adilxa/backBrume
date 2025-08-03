import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

class OtpService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Генерация 6-значного OTP кода
  generateOtpCode() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Отправка OTP на email
  async sendOtpEmail(email, otpCode) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Ваш код для входа",
      text: `Ваш код для входа: ${otpCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B4513; margin: 0;">☕ Coffee QR</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 10px; text-align: center;">
            <h2 style="color: #333; margin-top: 0;">Код для входа</h2>
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
              Введите этот код в приложении для входа:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #8B4513; letter-spacing: 5px;">
                ${otpCode}
              </span>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              Код действителен в течение 10 минут
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #999; font-size: 12px;">
              Если вы не запрашивали этот код, просто проигнорируйте это письмо
            </p>
          </div>
        </div>
      `,
    });
  }
}

export default new OtpService();
