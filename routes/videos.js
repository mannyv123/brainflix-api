const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid"); // Unique ID Generator
const fs = require("fs"); // fileSystem module
const videosData = require("../data/video-details.json");

//function to read data file
function readFile(file, callback) {
    fs.readFile(file, "utf8", callback);
}

//function to write to data file
function writeFile(file, data, callback) {
    fs.writeFile(file, JSON.stringify(data), callback);
}

//Provide list of videos
router.get("/", (request, response) => {
    //Read file
    readFile("./data/video-details.json", (err, data) => {
        //Return error if read file failed
        if (err) {
            return response.send(err); //see what http error code to send***
        }
        //If no error, parse data from json file and send selected details
        console.log("Request received for list");
        response.status(200).json(
            JSON.parse(data).map((video) => ({
                id: video.id,
                title: video.title,
                channel: video.channel,
                image: video.image,
            }))
        );
    });
});

//Provide details for selected video
router.get("/:id", (request, response) => {
    console.log("Request received for specific video");
    const videoId = request.params.id;
    response.status(200).send(videosData.find((video) => video.id === videoId));
});

module.exports = router;
