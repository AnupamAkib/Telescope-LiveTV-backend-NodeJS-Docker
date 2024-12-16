const axios = require("axios");
const tvData = require("../channels.json");
const api = require("../load_balancer/loadDistribute");
const moment = require('moment-timezone');
const channelController = require("../controllers/channelController");
const constants = require("../config/constants");

const manageChannels = async () => {
    console.log("driver running");

    let url = "";

    const hostname = process.env.BASE_URL || "http://localhost:3000";


    if(api.getDistributedAPI() == "API1"){ url = process.env.API1; }
    if(api.getDistributedAPI() == "API2"){ url = process.env.API2; }
    if(api.getDistributedAPI() == "API3"){ url = process.env.API3; }
    if(api.getDistributedAPI() == "API4"){ url = process.env.API4; }

    try{
        const response = await axios.get(url);

        if(response == null){
            throw new Error("response is null");
        }

        const data = response.data;

        if(data == null){
            throw new Error("response.data is null");
        }

        let vdo = data[0].videos;

        if(vdo == null){
            throw new Error("response.data[0].videos is null");
        }

        for(let i=0; i<vdo.length; i++){
            let found = false;
            for(let j=0; j<tvData.length; j++){
                if(vdo[i].channelName.trim() == tvData[j].title.trim()){
                    vdo[i].channelLogo = tvData[j].logo.length? hostname+tvData[j].logo : "";
                    vdo[i].country = tvData[j].country;
                    vdo[i].priority = tvData[j].priority;
                    found = true;
                    break;
                }
            }
            if(!found){
                vdo[i].country = "Z"; //no country
                vdo[i].priority = 101; //no priority
            }
        }

        let deletedChannelCnt = 0, newChannelCnt = 0, updatedChannelCnt = 0;

        for(let i=0; i<vdo.length; i++){
            const d = new Date();
            let currentTime = d.getTime();
            
            let _channel = await channelController.updateChannel({
                channelName : vdo[i].channelName,
                url : vdo[i].url,
                channelLogo : vdo[i].channelLogo,
                country: vdo[i].country,
                broker : api.getDistributedAPI(),
                priority : vdo[i].priority,
                lastUpdate : currentTime,
                lastUpdateTimeDate : getDhakaTime()
            });

            if(_channel == constants.NEW_CHANNEL_ADDED) newChannelCnt++;
            if(_channel == constants.EXISTING_CHANNEL_UPDATED) updatedChannelCnt++;
        }
        deletedChannelCnt = await channelController.filterBackdatedChannels();

        return {
            "newChannelAddedCnt" : newChannelCnt,
            "updatedChannelCnt" : updatedChannelCnt,
            "deletedChannelCnt" : deletedChannelCnt
        }
    }
    catch(err){
        console.log("error while updating channel => driver.js");
        console.log(err);
    }
}

const getDhakaTime = () => {
    const dhakaTime = moment().tz('Asia/Dhaka');
    return dhakaTime.format('D MMMM, YYYY | hh:mm A');
};

module.exports = {
    manageChannels
}