import nodemailer from 'nodemailer';

let transporter;

// Created lazily so dotenv has loaded before the env vars are read.
const getTransporter = () => {
  if (!transporter) {
    const port = Number(process.env.EMAIL_PORT) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = ({ to, subject, text, html }) =>
  getTransporter().sendMail({
    from: process.env.EMAIL_FROM || `JobTrackr <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });

export default sendEmail;
