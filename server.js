const express = require("express");
const app = express();
const videoRoutes = require("./routes/videos");

const port = 5001;

app.use("/videos", videoRoutes);

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
