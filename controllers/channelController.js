const Channel = require("../models/channelModel");
const User = require("../models/userModel");
const constants = require("../config/constants");

const updateChannel = async(req) => {
    try{
        let isExistChannel = await Channel.findOne({channelName : req.channelName});
        if(isExistChannel){
            let _channel = await Channel.findOne({ channelName: req.channelName });
            req.priority = req.priority;
            Object.assign(_channel, req);
            await _channel.save();
            return constants.EXISTING_CHANNEL_UPDATED;
        }
        else{
            let _channel = await Channel.create(req);
            return constants.NEW_CHANNEL_ADDED;
        }
    }
    catch(error){
        console.log("error while updating channel\n"+error);
        return constants.EXCEPTION;
    }
}


const filterBackdatedChannels = async() => {
    const d = new Date();
    let currentTime = d.getTime();

    const _channels = await Channel.find({});
    let cnt = 0;
    try{
        for (let channel of _channels) {
            if (currentTime - channel.lastUpdate > constants.CHANNEL_FILTER_TIME) { //delete channels that fetched before last 24 hours [86400000 milliseconds = 24 hours]
                await Channel.deleteOne({ channelName: channel.channelName });
                console.log(`Deleted channel: ${channel.channelName}`);
                cnt++;
            }
        }
        return cnt;
    }
    catch(error){
        console.log("error while filtering channel\n"+error);
        return constants.EXCEPTION;
    }
}

const getAllChannels = async(req, res) => {
    let _channels = await Channel.find({});
    _channels = sortChannels(_channels);

    if(req.isAuthenticated){
        if(req.isEmailVerified){
            return res.status(200).json([
                {
                    message : "success",
                    channelCount : _channels.length,
                    user : {
                        "fullName" : req.fullName,
                        "username" : req.username,
                        "emailAddress" : req.emailAddress,
                        "isEmailVerified" : req.isEmailVerified
                    },
                    videos : _channels
                }
            ]);
        }
        else{
            const CHANNEL_COUNT_NO_USER = constants.CHANNEL_COUNT_NO_USER;
            return res.status(200).json([
                {
                    message : "Please verify your email address to access all the channels",
                    channelCount : _channels.length,
                    user : {
                        "fullName" : req.fullName,
                        "username" : req.username,
                        "emailAddress" : req.emailAddress,
                        "isEmailVerified" : req.isEmailVerified
                    },
                    videos : _channels.slice(0, CHANNEL_COUNT_NO_USER)
                }
            ]);
        }
    }
    else{
        try{
            const CHANNEL_COUNT_NO_USER = constants.CHANNEL_COUNT_NO_USER;
            return res.status(200).json([
                {
                    message : "Please login or signup to access all the channels",
                    channelCount : _channels.length,
                    user : "NO USER",
                    videos : _channels.slice(0, CHANNEL_COUNT_NO_USER)
                }
            ]);
        }
        catch(error){
            return res.status(500).json({
                message : "something went wrong!"
            });
        }
    }
}


const checkChannelAvailableToUser = async (req, res) => {
    try{
        const CHANNEL_COUNT_NO_USER = constants.CHANNEL_COUNT_NO_USER;
        const channelNameToCheck = req.body.channelName;
        
        if(req.isAuthenticated && req.isEmailVerified){
            return res.status(200).json({
                message : "success"
            });
        }
        const channels = await Channel.find().limit(CHANNEL_COUNT_NO_USER).exec();
        const channelExists = channels.some(channel => channel.channelName === channelNameToCheck);
        
        if(channelExists){
            return res.status(200).json({
                message : "success"
            });
        }
        else{
            return res.status(401).json({
                message : "Failed to load channel"
            });
        }
    }
    catch(error){
        return res.status(400).json({
            message : "failed"
        });
    }
}

const sortChannels = (channels) => {
    return channels.sort((a, b) => {
        //first sort by country
        if (a.country < b.country) return -1;
        if (a.country > b.country) return 1;

        // If countries are the same, compare by lastUpdate within 60000 milliseconds
        const lastUpdateDiff = a.lastUpdate - b.lastUpdate;
        if (lastUpdateDiff > 60000) return -1;
        if (lastUpdateDiff < 0) return 1;
        
        // If last update difference same, compare by priority
        if(a.priority < b.priority) return -1;
        if(a.priority > b.priority) return 1;

        // If lastUpdate difference is greater than 60000 milliseconds, maintain original order
        return 0;
    });
};


module.exports = {
    updateChannel,
    getAllChannels,
    filterBackdatedChannels,
    checkChannelAvailableToUser
}