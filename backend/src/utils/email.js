import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html, attachments = [] }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Gmail con 587 NO usa secure true
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // 🔥 NECESARIO PARA EVITAR EL ERROR DEL CERTIFICADO
    },
  });

  return transporter.sendMail({
    from: `"CampusUC" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments,
  });
};
