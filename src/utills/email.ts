import nodemailer from 'nodemailer';
import { config } from  '../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

interface MailOption {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  from,
}: MailOption) => {
  const mailOptions = {
    from: from || config.emailUser,
    to,
    subject,
    ...(text ? { text } : { html }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true };
  } catch (error: any) {
    console.error('Email send error:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};
