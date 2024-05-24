var cors = require('cors')
require('dotenv').config()
const axios = require('axios');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var puppeteer = require('puppeteer');
var app = express();
var multer = multer();

app.use(cors());
app.use(bodyParser.json());
app.use(multer.array()); //for parsing multiple/form-data
app.use(express.static('assets'));

const PORT = process.env.PORT || 3000;


const tvData = [
    {
        title : "Ekattor TV",
        country: "BD",
        logo : "/ekattor.jpg"
    },{
        title : "SOMOY TV",
        country: "BD",
        logo : "/somoy.jpg"
    },{
        title : "Independent Television",
        country: "BD",
        logo : "/independent.jpg"
    },{
        title : "Jamuna TV",
        country: "BD",
        logo : "/jamuna.jpg"
    },{
        title : "Channel 24",
        country: "BD",
        logo : "/channel24.jpg"
    },{
        title : "Rtv News",
        country: "BD",
        logo : "/rtv.jpg"
    },{
        title : "Jamuna TV Plus",
        country: "BD",
        logo : "/jamuna.jpg"
    },{
        title : "EKHON TV",
        country: "BD",
        logo : "/ekhon.jpg"
    },{
        title : "TV9 Bangla",
        country: "IN",
        logo : "/tv9.jpg"
    },{
        title : "ATN News",
        country: "BD",
        logo : "/atn_news.jpg"
    },{
        title : "ATN News Live",
        country: "BD",
        logo : "/atn_news.jpg"
    },{
        title : "Zee 24 Ghanta",
        country: "IN",
        logo : "/zee24hour.jpg"
    },{
        title : "ABP ANANDA",
        country: "IN",
        logo : "/abp.jpg"
    },{
        title : "DBC NEWS",
        country: "BD",
        logo : ""
    },{
        title : "Rtv Music",
        country: "BD",
        logo : ""
    },{
        title : "Al Jazeera English",
        country: "X",
        logo : "/aljazeera.jpg"
    },{
        title : "NASA",
        country: "X",
        logo : "/nasa.jpg"
    },{
        title : "Zee News",
        country: "IN",
        logo : "/zee_news.jpg"
    },{
        title : "TRT World",
        country: "X",
        logo : "/trt.jpg"
    },{
        title : "NDTV India",
        country: "IN",
        logo : "/ndtv.jpg"
    },{
        title : "News24 Daily",
        country: "BD",
        logo : "/news24.jpg"
    },{
        title : "Channel i News",
        country: "BD",
        logo : "/channel_i.jpg"
    },{
        title : "NTV Live",
        country: "BD",
        logo : "/ntv.jpg"
    },{
        title : "BanglaVision LIVE",
        country: "BD",
        logo : "/banglavision.jpg"
    }
];

app.listen(PORT, function () {
    console.log("Server Started");
})





const url = "https://api.apify.com/v2/acts/apify~puppeteer-scraper/runs/last/dataset/items?token=apify_api_A2Gxh0PYVUL1pc6XHmHDvk53I1wlaf0Mp3dV";


const hostname = "https://livetv-njf6.onrender.com";

//const hostname = "http://localhost:3000";


app.get("/", function (req, res) {
    res.send("<h1>Server Running...</h1>");
})


app.get("/tv", async function(req, res){
    try {
        const response = await axios.get(url);
        const data = response.data;

        let vdo = data[0].videos;

        console.log(vdo)

        for(let i=0; i<vdo.length; i++){
            let found = false;
            for(let j=0; j<tvData.length; j++){
                if(vdo[i].channelName == tvData[j].title){
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
          

        data[0].videos = vdo;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error searching YouTube:', error);
        res.status(500).json({ error: 'An error occurred while fetching live videos.' });
    }
})

