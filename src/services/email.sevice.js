import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

class MailService {
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

  async sendActivationMail(user_id, to, subject, message) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: subject || "Activation link",
      text: `${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #007BFF;">Welcome!</h1>
          <p>${user_id}</p>
          <p>Click the link below to activate your account:</p>
            <p>Thank you for joining us!</p>
            <p>&copy; 2024 Your Company Name</p>
          </footer>
        </div>
      `,
    });
  }
}

export default new MailService();
