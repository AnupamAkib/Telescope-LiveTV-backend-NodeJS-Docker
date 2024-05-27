var cors = require('cors')
require('dotenv').config()
const axios = require('axios');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var multer = multer();

app.use(cors());
app.use(bodyParser.json());
app.use(multer.array()); //for parsing multiple/form-data
app.use(express.static('assets'));

const PORT = process.env.PORT || 3000;


//console.log(tvData);

app.listen(PORT, function () {
    console.log("Server Started");
})

const tvData = require("./channels.json");

const api = require("./LoadBalancing/load_distributing");

const url = process.env[api.getDistributedAPI()];


const hostname = "https://livetv-njf6.onrender.com";

//const hostname = "http://localhost:3000";


app.get("/", function (req, res) {
    //console.log(url);
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
          

        data[0].videos = vdo;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error searching YouTube:', error);
        res.status(500).json({ error: 'An error occurred while fetching live videos.' });
    }
})

