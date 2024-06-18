var cors = require('cors')
require('dotenv').config();
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


app.get("/", function (req, res) {
    res.send("<h1>Live TV | Server Running</h1>");
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
const userRoute = require("./routes/userRoute");

app.use("/tv", channelRoute); //Channel Route
app.use("/user", userRoute); //User Route



// Catch-all route for undefined routes (for debugging purposes)
app.get('*', function(req, res){
    res.status(404).send("<h1>404 Not Found!</h1>");
});