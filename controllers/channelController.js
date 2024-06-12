const Channel = require("../models/Channel");
const constants = require("../config/constants");

const updateChannel = async(req) => {
    try{
        let isExistChannel = await Channel.findOne({channelName : req.channelName});
        if(isExistChannel){
            //simply update it to database with higher priority
            let _channel = await Channel.findOne({ channelName: req.channelName });
            req.priority = 1;
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
    try{
        let _channels = await Channel.find({});
        console.log(`${_channels.length} channels fetched`);


        _channels = sortChannels(_channels);

        res.status(200).json({
            message : `${_channels.length} channels found`,
            channels : _channels
        });
    }
    catch(error){
        console.log("error while fetching channels\n"+error);
        res.status(400).json({
            message : "Error fetching channels"
        });
    }
}

const sortChannels = (channels) => {
    return channels.sort((a, b) => {
        // Sort by country, prioritize "BD", if country same prioritize lastUpdate
        if (a.country < b.country) {
            return -1;
        } 
        else if (a.country > b.country) {
            return 1;
        }
        else if (a.country === b.country) {
            return b.lastUpdate - a.lastUpdate;
        }
        return 0;
    });
};
  

module.exports = {
    updateChannel,
    getAllChannels,
    filterBackdatedChannels
}