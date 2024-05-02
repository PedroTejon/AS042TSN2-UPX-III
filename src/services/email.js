const config = require('../config')
const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.emailUser,
        pass: config.emailPassword,
    }
});

async function sendMail(target, subject, text) {
    const mailOptions = {
        from: config.emailUser,
        to: target,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw error
        }
    });
}

module.exports = {
    sendMail
}