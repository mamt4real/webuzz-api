const nodemailer = require("nodemailer");
const catchAsync = require("./catchAsync");


const sendEmail = catchAsync(async options => {

    const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth:{
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: "Mahadi Abuhuraira <mamt4real@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transport.sendMail(mailOptions);

});

module.exports = sendEmail;