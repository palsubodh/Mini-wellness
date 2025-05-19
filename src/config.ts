import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  smtpHost: process.env.SMTP_HOST!,
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  emailUser: process.env.NODEMAILER_AUTH_EMAIL!,
  emailPass: process.env.NODEMAILER_AUTH_PASS!,
};
