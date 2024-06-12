const mongoose = require("mongoose");

const channelSchema = mongoose.Schema(
    {
        channelName : {
            type : String,
            require : true,
            trim : true
        },
        URL : {
            type : String,
            require : true
        },
        logo : {
            type : String
        },
        country : {
            type : String
        },
        broker : {
            type : String
        },
        priority : {
            type : Number
        },
        lastUpdate : {
            type : Number
        },
        lastUpdateTimeDate : {
            type : String
        }
    }
);

//export model
const Channel = mongoose.model("Channel", channelSchema);
module.exports = Channel;