const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authGuard = async (req, res, next) => {
    const {authorization} = req.headers;
    try{
        const token = authorization.split(' ')[1]; //reduce the Bearer part, get only token
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const {username, fullName, emailAddress, id} = decodedPayload;

        const _user = await User.findOne({username : username});

        if(_user){
            req.username = username;
            req.fullName = fullName;
            req.emailAddress = emailAddress;
            req.isEmailVerified = _user.isEmailVerified;
            req.isAuthenticated = true;
        }
        else{
            req.isAuthenticated = false;
        }
        next();
    }
    catch(error){
        req.isAuthenticated = false;
        next();
    }
}

module.exports = authGuard;