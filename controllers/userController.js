const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const constants = require("../config/constants");

const registerNewUser = async(req, res) => {
    try{
        req.body.isEmailVerified = false;
        const _user = await User.create(req.body);
        const token = jwt.sign({
            fullName : _user.fullName,
            username : _user.username,
            emailAddress : _user.emailAddress
        }, process.env.JWT_SECRET_KEY, {
            expiresIn : constants.JWT_EXPIRES_AFTER
        });

        sendEmailForVerification(_user);

        res.status(200).json({
            message : "success", 
            accessToken : token, 
            user : _user
        });
    }
    catch(error){
        if (error.name === 'ValidationError') { // Handle validation errors
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message : errors[0], errors //only send first error at once
            });
        } 
        else {
            // Handle other errors
            console.error(error);
            res.status(500).send({
                message : "Internal Server Error"
            });
        }
    }
}


const sendEmailForVerification = (_user) => {
    const mail = require("../EmailServices/sendMail");

    const _msg = `
    <div style="padding:15px; background:#f0f0f0; font-size:19px;">
    <h1 align='center'>Telescope</h1><hr/>
    Hello <b>${_user.fullName}</b>, <br/>Welcome to Telescope Live TV app. 
    Your registration is completed successfully. Now, you need to verify your email address to access all the channels. 
    Please click the below link to confirm your email address.
    <br/><br/>
    <a href="#">https://telescope-live.netlify.app/user/verifyEmail?id=${_user._id}</a>
    <br/><br/>
    Thanks for using Telescope Live TV. Wishing a great experience!<br/><br/>
    Thanks & Regards,<br/>
    <b>Telescope Engineering Team<b>
    </div><br/>
    <i>[This is a system generated email. You don't need to reply to this email]</i>
    `;

    mail.sendmail({
        _to : _user.emailAddress,
        _subject : "Please verify your email address",
        _msgBody : _msg
    });
}

const login = async(req, res) => {
    try{
        const username = req.body.username;
        const password = md5(req.body.password);

        let existingUser = await User.findOne({ //login with username
            username, password
        });

        if(existingUser){
            const token = jwt.sign({
                fullName : existingUser.fullName,
                username : existingUser.username,
                emailAddress : existingUser.emailAddress
            }, process.env.JWT_SECRET_KEY, {
                expiresIn : constants.JWT_EXPIRES_AFTER
            });
            res.status(200).json({
                message : "success", 
                accessToken : token, 
                user : existingUser
            });
        }
        else{
            res.status(400).json({
                message : "Login failed! Enter valid credential"
            });
        }
    }
    catch(error){
        res.status(400).json({
            message : "Sorry, something went wrong!"
        });
    }
}

const verifyEmailAddress = async (req, res) => {
    try{
        const userId = req.query.id;
        let _user = await User.findById(userId);

        if(!_user.isEmailVerified){
            await User.updateOne(
                { _id: userId },
                { $set: { isEmailVerified: true } }
            );

            res.status(200).json({
                message : "success",
                user : _user.username
            });
        }
        else{
            res.status(200).json({
                message : "Email already verified",
                user : _user.username
            });
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message : "Sorry, something went wrong!"
        });
    }
}

module.exports = {
    registerNewUser,
    login,
    verifyEmailAddress
}