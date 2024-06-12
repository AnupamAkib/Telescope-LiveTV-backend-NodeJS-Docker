var cors = require('cors')
require('dotenv').config()
const axios = require('axios');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var multer = multer();

const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.json());
app.use(multer.array()); //for parsing multiple/form-data
app.use(express.static('assets'));

const PORT = process.env.PORT || 3000;

/*app.listen(PORT, function () {
    console.log("Server Started");
});*/



//-----------------------------------------------------

app.get("/", function (req, res) {
    res.send("<h1>Server Running (MVC)</h1>");
});

app.get("/updateChannel", async function (req, res) { //to keep updating database
    const driver = require("./controllers/driver");
    let r = await driver.manageChannels();
    res.status(200).send({
        message : "success",
        status: r
    });
});

const MONGO_CONNECTION_STRING = process.env.MONGODB_URL;


mongoose
  .connect(MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Node API app is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });


const channelRoute = require("./routes/channelRoute");

app.use("/channel", channelRoute); //Channel Route







//LEGACY CODE - UP & RUNNING!

app.get("/tv", async function (req, res) { // LEGACY CODEBASE FOR TEMPORARY SUPPORT
  const tvData = require("./channels.json");
  const api = require("./LoadBalancing/load_distributing");
  let url = "";
  const hostname = "https://livetv-njf6.onrender.com";

  try {
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
      
    data[0].videos = vdo;

    res.status(200).json(data);
  } catch (error) {
      console.error('Error searching YouTube:', error);
      res.status(500).json({ error: 'An error occurred while fetching live videos.' });
  }

});





// Catch-all route for undefined routes (for debugging purposes)
app.get('*', function(req, res){
    res.status(404).send("<h1>404 Not Found!</h1>");
});

