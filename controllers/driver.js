const axios = require("axios");
const tvData = require("../channels.json");
const api = require("../LoadBalancing/load_distributing");
const moment = require('moment-timezone');
const channelController = require("../controllers/channelController");
const constants = require("../config/constants");

const manageChannels = async () => {
    console.log("driver");

    let url = "";

    const hostname = "https://livetv-njf6.onrender.com";

    //const hostname = "http://localhost:3000";


    if(api.getDistributedAPI() == "API1"){ url = process.env.API1; }
    if(api.getDistributedAPI() == "API2"){ url = process.env.API2; }
    if(api.getDistributedAPI() == "API3"){ url = process.env.API3; }
    if(api.getDistributedAPI() == "API4"){ url = process.env.API4; }

    console.log(api.getDistributedAPI());
    console.log(url);

    const response = await axios.get(url);
    const data = response.data;

    let vdo = data[0].videos;

    //console.log(vdo)

    for(let i=0; i<vdo.length; i++){
        let found = false;
        for(let j=0; j<tvData.length; j++){
            if(vdo[i].channelName.trim() == tvData[j].title.trim()){
                vdo[i].channelLogo = tvData[j].logo.length? hostname+tvData[j].logo : "";
                vdo[i].country = tvData[j].country;
                found = true;
                break;
            }
        }
        if(!found){
            vdo[i].country = "Z";
        }
    }

    vdo.sort((a, b) => {
        if (a.country < b.country) {
            return -1;
        } else if (a.country > b.country) {
            return 1;
        } else {
            return 0;
        }
    });

    let deletedChannelCnt = 0, newChannelCnt = 0, updatedChannelCnt = 0;

    for(let i=0; i<vdo.length; i++){
        const d = new Date();
        let currentTime = d.getTime();
        
        let _channel = await channelController.updateChannel({
            channelName : vdo[i].channelName,
            URL : vdo[i].url,
            logo : vdo[i].channelLogo,
            country: vdo[i].country,
            broker : api.getDistributedAPI(),
            priority : 1,
            lastUpdate : currentTime,
            lastUpdateTimeDate : getDhakaTime()
        });
        //console.log(_channel);
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

const getDhakaTime = () => {
    const dhakaTime = moment().tz('Asia/Dhaka');
    return dhakaTime.format('D MMMM, YYYY | hh:mm A');
};

module.exports = {
    manageChannels
}