const express = require("express");
const app = express();
const cors = require("cors");
const videoRoutes = require("./routes/videos");

const port = 5001;

// Middleware
app.use(cors()); //allows sharing data / api calls between apps on different servers
app.use(express.static("public")); //allows access to the public folder, where video images are stored
app.use(express.json()); //allows access to incoming data posted to the server as part of the req.body

// Routes
app.use("/videos", videoRoutes);

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
