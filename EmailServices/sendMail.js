const nodemailer = require('nodemailer');

const sendmail = (req, res) => {
    const _to = req._to;
    const _subject = req._subject;
    const _msgBody = req._msgBody;

    let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSKEY
        },
        tls: {
            ciphers: 'SSLv3' 
        }
    });

    let mailOptions = {
        from: '"Telescope LIVE" <telescopelive@outlook.com>', // sender address
        to: _to, // list of receivers
        subject: _subject, // Subject line
        html: _msgBody // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(401).json({
                message : "failed"
            })
        }
        console.log("message sent!");
        res.status(200).json({
            message : "success"
        })
    });
}

module.exports = {
    sendmail
}