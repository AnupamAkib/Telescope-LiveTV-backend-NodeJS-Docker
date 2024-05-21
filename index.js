var cors = require('cors')
require('dotenv').config()

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var puppeteer = require('puppeteer');
var app = express();
var multer = multer();

app.use(cors());
app.use(bodyParser.json());
app.use(multer.array()); //for parsing multiple/form-data

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server Started");
})


app.get("/", function (req, res) {
    res.send("<h1>Server Running...</h1>");
})


app.get("/tv", async function(req, res){
    try {
        const videos = await searchLiveYouTube("Bangla+Live+TV");
        res.json(videos);
    } catch (error) {
        console.error('Error searching YouTube:', error);
        res.status(500).json({ error: 'An error occurred while fetching live videos.' });
    }
})


let _browser;

async function initBrowser() {
    if (!_browser) { //for optimization 
        _browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1280x800'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
        });
    }
    return _browser; 
}

async function searchLiveYouTube(query) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
    });

    //const browser = await initBrowser();

    const page = await browser.newPage();
    const searchUrl = `https://www.youtube.com/results?search_query=${query}&sp=EgJAAQ%253D%253D`;

    console.log(searchUrl);

    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 90000 }); //90 seconds

    const videos = await page.evaluate(() => {
        const videoNodes = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer');
        const liveVideos = [];

        const urlFilter = (url) => {
            let s = url.split('&')[0];
            url = s.split('=')[1];
            return "https://www.youtube.com/embed/" + url;
        };

        videoNodes.forEach((video) => {
            const url = urlFilter(video.querySelector('#video-title').href);
            const channelName = video.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string').innerText;
            liveVideos.push({ channelName, url });
        });

        return liveVideos;
    });

    await browser.close();
    return videos;
}


