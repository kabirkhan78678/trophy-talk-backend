import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Msg from '../utils/message.js';

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: 465,
//     secure: true,
//     auth: {
//         user: EMAIL_USER,
//         pass: EMAIL_PASS
//     },
//     tls: {
//         rejectUnauthorized: false
//     }

// });

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

const sendEmail = async (emailOptions) => {
    const mailOptions = {
        from: EMAIL_USER,
        to: emailOptions.to,
        subject: emailOptions.subject,
        html: emailOptions.html,
        attachments: emailOptions.attachments || []
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${emailOptions.to}`);
    } catch (error) {
        console.log('error', error);
        throw new Error(Msg.errorToSendingEmail);
    }
};

// const sendSupportEmail = async (emailOptions) => {
//     const mailOptions = {
//         from: emailOptions.to,
//         to: ADMIN_EMAIL,
//         subject: emailOptions.subject,
//         html: emailOptions.html,
//     };
//     try {
//         await transporter.sendMail(mailOptions);
//         console.log(`Email sent to ${ADMIN_EMAIL}`);
//     } catch (error) {
//         throw new Error(Msg.errorToSendingEmail);
//     }
// };

const sendSupportEmail = async (emailOptions) => {
    const mailOptions = {
        from: emailOptions.to,
        to: 'justin@trophytalks.com',
        subject: emailOptions.subject,
        html: emailOptions.html,
        envelope: {
            from: 'accounts@trophytalks.com',
            to: 'justin@trophytalks.com'
        }
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${EMAIL_USER}`);
    } catch (error) {
        throw new Error(Msg.errorToSendingEmail);
    }
};

export { sendEmail, sendSupportEmail };
