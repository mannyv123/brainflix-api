const express = require("express");
const router = express.Router();
const videosData = require("../data/video-details.json");

//Provide list of videos
router.get("/", (request, response) => {
    console.log("Request received");
    response.status(200).send(
        videosData.map((video) => ({
            id: video.id,
            title: video.title,
            channel: video.channel,
            image: video.image,
        }))
    );
});

//Provide details for selected video
router.get("/:id", (request, response) => {
    console.log("Request received for specific video");
    const videoId = request.params.id;
    response.status(200).send(videosData.find((video) => video.id === videoId));
});

module.exports = router;
