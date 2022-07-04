
const { Socket } = require('socket.io');

const express = require("express");

const app = express();
const http = require("http").createServer(app);
const path = require("path");
const port = 3000;

/**
 * @type {Socket}
*/
const io = require("socket.io")(http);

const fs = require("fs");
const fileName = "data.json";

app.use("/jquery", express.static(path.join(__dirname, "node_modules/jquery/dist")));
app.use(express.static("public"));
 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

http.listen(port, () => {
   console.log(`App server is running on port ${port}`);
});

io.on("connection", (socket) => {
    
});

function createRoom(dataToAdd) {
    fs.readFile(fileName, "utf8", (err, data) => {
        if (err) console.log(err);
        else {
        obj = JSON.parse(data);
        obj.rooms.push(dataToAdd);
        fs.writeFile(fileName, JSON.stringify(obj), "utf8", () => {});
    }});
}