const nodemailer = require('nodemailer');

const createGmailTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: (process.env.EMAIL_USER || '').trim(),
            pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, '')
        }
    });
};

const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ EMAIL_USER or EMAIL_PASS is not configured in backend/.env');
        return null;
    }

    const transporter = createGmailTransporter();
    const mailOptions = {
        from: `"Organic Store" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email successfully delivered to ${to}: ${info.messageId}`);
    return info;
};

module.exports = { sendEmail };