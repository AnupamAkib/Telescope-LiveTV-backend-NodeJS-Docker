const jwt = require("jsonwebtoken");

const authGuard = (req, res, next) => {
    const {authorization} = req.headers;
    try{
        const token = authorization.split(' ')[1]; //reduce the Bearer part, get only token
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const {username, fullName, emailAddress, id} = decodedPayload;
        req.username = username;
        req.fullName = fullName;
        req.emailAddress = emailAddress;
        req.id = id;
        next();
    }
    catch(error){
        res.status(401).json({
            message : "Authentication failed! Please login"
        });
        next("Authentication failed!");
    }
}

module.exports = authGuard;