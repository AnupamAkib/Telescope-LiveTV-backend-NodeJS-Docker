const md5 = require("md5");
const { mongoose } = require("mongoose");
const {onlyAlphaLetters, isLengthValid, capitalizeFirstLetter, isValidPhoneNumber, isEmailValid} = require("../validation/inputValidation");

const userSchema = mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true,
            trim : true,
            validate : [
                {
                    validator : onlyAlphaLetters,
                    message: "Invalid First Name"
                },
                {
                    validator: isLengthValid(0, 25),
                    message: props => `First name is too large`
                }
            ]
        },
        lastName : {
            type : String,
            required : true,
            trim : true,
            validate : [
                {
                    validator: onlyAlphaLetters,
                    message: "Invalid Last Name"
                },
                {
                    validator: isLengthValid(0, 25),
                    message: props => `Last name is too large.`
                }
            ]
        },
        username : {
            type : String,
            required : true,
            trim : true,
            validate : [
                {
                    validator: async function(v) { //username should be unique. check if already exist
                        const existingUser = await this.constructor.findOne({ username: v });
                        return !existingUser;
                    },
                    message: props => `The username is already in use. Please choose a different one.`
                },
                {
                    validator: isLengthValid(0, 50),
                    message: props => `The username is too large.`
                }
            ]
        },
        password : {
            type : String,
            required : true,
            validate : [
                {
                    validator: isLengthValid(6, 20),
                    message: props => `The password must contain 6 to 20 characters.`
                }
            ]
        },
        emailAddress : {
            type : String,
            unique : true,
            required : true,
            trim : true,
            validate: [
                {
                    validator: async function(v) { //email address should be unique. check if already exist
                        const existingEmail = await this.constructor.findOne({ emailAddress: v });
                        return !existingEmail;
                    },
                    message: props => `The email is already in use. Please choose a different one.`
                },
                {
                    validator: isLengthValid(0, 50),
                    message: props => `The email address is too large.`
                },
                {
                    validator: isEmailValid,
                    message: props => `Invalid email address.`
                }
            ]
        }
    },
    {
        timestamps : true
    }
);

// Middleware to capitalize first character of firstName and lastName before saving and hash password
userSchema.pre('save', function(next) {
    this.firstName = capitalizeFirstLetter(this.firstName);
    this.lastName = capitalizeFirstLetter(this.lastName);
    this.password = md5(this.password);
    next();
});

// Define a virtual property for fullName
userSchema.virtual('fullName').get(function() {
    return this.firstName.trim() + " " + this.lastName.trim();
});

// Enable virual property 
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
//enable unique index for unique value in schema
userSchema.index({ username: 1 }, { unique: true });


// Export model
const User = mongoose.model("User", userSchema);
module.exports = User;