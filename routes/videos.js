const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid"); // Unique ID Generator
const fs = require("fs"); // fileSystem module
const multer = require("multer");
// const videosData = require("../data/video-details.json");

//Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "public/images/");
    },
    filename: (req, file, callback) => {
        callback(null, `${+Date.now()}-${file.originalname}`);
    },
    limits: { fieldSize: 10 * 1024 * 1024 },
});
const upload = multer({ storage });

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
    //Read file
    readFile("./data/video-details.json", (err, data) => {
        //Return error if read file failed
        if (err) {
            return response.send(err); //see what http error code to send***
        }
        //If no error, parse data from json file and send selected video
        console.log("Request received for specific video");
        const videoId = request.params.id;
        response.status(200).json(JSON.parse(data).find((video) => video.id === videoId));
    });
});

//look into MIME types
//Post new video
router.post("/", upload.single("file"), (request, response) => {
    //Check if request body is blank
    if (request.body.title === "" || request.body.description === "") {
        //need to add validation for image file*****
        return response.status(400).send("Information cannot be blank");
    }

    //Read file to get latest data
    readFile("./data/video-details.json", (err, data) => {
        //Return error if read file failed
        if (err) {
            return response.send(err); //see what http error code to send***
        }
        //If no error, save data in variable; parse JSON data to convert to JS
        const videoData = JSON.parse(data);

        // Create new video post
        const newVideo = {
            id: uuidv4(),
            title: request.body.title,
            channel: "Anonymous User",
            image: `/images/${request.file.filename}`,
            description: request.body.description,
            views: 0,
            likes: 0,
            duration: "1:01",
            video: "https://project-2-api.herokuapp.com/stream",
            timestamp: Date.now(),
            comments: [],
        };

        //Push new video to videoData array
        videoData.push(newVideo);

        //Write updated videoData array to JSON file
        writeFile("./data/video-details.json", videoData, (err) => {
            if (err) {
                return response.send(err); //see what http error code to send***
            }
            response.status(201).send(newVideo);
        });
    });
});

//Post new comments
router.post("/:videoId/comments", (request, response) => {
    //check if request body is blank

    //Read video list data
    readFile("./data/video-details.json", (err, data) => {
        if (err) {
            return response.send(err); //see what http error code to send***
        }
        const videoId = request.params.videoId;
        const videoData = JSON.parse(data); //.find((video) => videoId === video.id);
        const index = videoData.findIndex((video) => video.id === videoId);

        //Create new comment post
        const newComment = {
            id: uuidv4(),
            name: "Anonymous User",
            comment: request.body.comment,
            likes: 0,
            timestamp: Date.now(),
        };

        //Push new comment to the currentVideo
        videoData[index].comments.push(newComment);

        //Write updated videoData array to JSON file
        writeFile("./data/video-details.json", videoData, (err) => {
            if (err) {
                return response.send(err); //see what http error code to send***
            }
            response.status(201).send(newComment);
        });
    });
});

//Delete comments
router.delete("/:videoId/comments/:commentId", (request, response) => {
    //Read video list data
    readFile("./data/video-details.json", (err, data) => {
        if (err) {
            return response.send(err); //see what http error code to send***
        }

        // const videoId = request.params.videoId
        // const commentId = request.params.commentId
        const { videoId, commentId } = request.params;
        const videoData = JSON.parse(data);

        const videoIndex = videoData.findIndex((video) => video.id === videoId);
        const commentIndex = videoData[videoIndex].comments.findIndex((comment) => comment.id === commentId);

        //Delete comment
        videoData[videoIndex].comments.splice(commentIndex, 1);

        //Write updated videoData array to JSON file
        writeFile("./data/video-details.json", videoData, (err) => {
            if (err) {
                return response.send(err); //see what http error code to send***
            }
            response.status(200).send("Comment Deleted"); // find the right http status code ****
        });
    });
});

//Like Videos
router.post("/:videoId/likes", (request, response) => {
    //Read video list data
    readFile("./data/video-details.json", (err, data) => {
        if (err) {
            return response.send(err); //see what http error code to send***
        }
        const { videoId } = request.params;
        const videoData = JSON.parse(data);
        const videoIndex = videoData.findIndex((video) => video.id === videoId);

        //Increment like count
        console.log(videoData[videoIndex].likes);
        let likes = videoData[videoIndex].likes;
        console.log(typeof likes);
        if (typeof likes === "string") {
            if (likes.includes(",")) {
                likes = likes.split(",");
                likes = likes.join("");
            }
        }
        ++likes;
        likes = likes.toLocaleString("en-US");
        videoData[videoIndex].likes = likes;
        console.log(videoData[videoIndex].likes);

        //Write updated videoData array to JSON file
        writeFile("./data/video-details.json", videoData, (err) => {
            if (err) {
                return response.send(err); //see what http error code to send***
            }
            response.status(200).send("video liked"); //find the right http status code***
        });
    });
});

module.exports = router;
