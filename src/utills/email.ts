
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: "Gmail",
      auth: {
        user: process.env.NODEMAILER_AUTH_EMAIL,
        pass: process.env.NODEMAILER_AUTH_PASS,
      },

});

interface MailOption {
    to: string,
    subject: string,
    text?: string,
    html?: string,
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  from,
}: MailOption & { from?: string }) => {
  const mailOptions = {
    from: from ,
    to,
    subject,
    ...(!!text ? { text } : { html }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {success: true, data: info}
} catch (error) {
    return {success: false, error: error}
  }
};

