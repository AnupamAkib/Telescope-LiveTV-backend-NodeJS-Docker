const mongoose = require("mongoose");
const moment = require('moment');

const activitySchema = mongoose.Schema(
    {
        username : {
            type : String,
            require : true
        },
        fullName : {
            type : String,
            require : true
        },
        activity : {
            type : String,
            require : true
        },
        timeDate : {
            type : String
        }
    }
);

activitySchema.pre('save', function(next) {
    const moment = require('moment-timezone');
    const now = moment().tz('Asia/Dhaka');
    const formattedDateTime = now.format('hh:mm A | D MMMM, YYYY');     
    this.timeDate = formattedDateTime;
    next();
});

//export model
const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;