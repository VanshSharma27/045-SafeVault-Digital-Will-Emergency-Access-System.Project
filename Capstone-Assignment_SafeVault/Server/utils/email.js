const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, userId) => {
  const verifyUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/api/auth/verify/${userId}`;
  await transporter.sendMail({
    from: `"SafeVault" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your SafeVault account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#0c0c18;color:#f2edd8;padding:32px;border-radius:12px;">
        <h2 style="color:#d4a017;">SafeVault — Verify Email</h2>
        <p style="color:#a09888;margin-bottom:24px;">Click below to verify your email and access your vault.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#d4a017;color:#0a0700;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;">Verify Email</a>
        <p style="margin-top:24px;font-size:12px;color:#6b6358;">If you did not create this account, ignore this email.</p>
      </div>`
  });
};

// subject is optional - has default
const sendAlertEmail = async (toEmail, htmlBody, subject = 'SafeVault Security Alert') => {
  await transporter.sendMail({
    from: `"SafeVault" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#0c0c18;color:#f2edd8;padding:32px;border-radius:12px;border:1px solid rgba(212,160,23,.3);">
        ${htmlBody}
        <hr style="border-color:rgba(255,255,255,.1);margin:24px 0"/>
        <p style="font-size:11px;color:#6b6358;">SafeVault Automated Security System · Do not reply to this email.</p>
      </div>`
  });
};

module.exports = { sendVerificationEmail, sendAlertEmail };
