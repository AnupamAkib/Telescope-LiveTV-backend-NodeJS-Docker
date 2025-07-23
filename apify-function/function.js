//Start URL: https://www.youtube.com/results?search_query=Bangladesh+Live+TV+bangla&sp=EgJAAQ%253D%253D

async function pageFunction(context) {
    const { page, request, log } = context;
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
            const channelLogo = video.querySelector('#img').src;

            if (channelLogo.includes('s48')) {
                channelLogo = channelLogo.replace('s48', 's240');
            }

            liveVideos.push({ channelName, channelLogo, url });
        });

        return liveVideos;
    });

    const currentTime = new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Dhaka'
    });

    const response = {
        url: request.url,
	    broker : "API 4",
        videos,
        lastExecution: currentTime
    };

    log.info(`URL: ${request.url} videos: ${JSON.stringify(videos)} currentTime: ${currentTime}`);

    return response;
}
