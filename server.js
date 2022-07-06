
const { Socket } = require('socket.io');

const express = require("express");

const $ = require("jquery");

const app = express();
const http = require("http").createServer(app);
const path = require("path");
const port = 3000;

/**
 * @type {Socket}
*/
const io = require("socket.io")(http);

const fs = require('fs');
const fileName = "data.json";

fs.writeFile(fileName, JSON.stringify({"users":{},"rooms":{}}), (e) => {
    if (e) console.log(e);
});

function getFile() {
    return JSON.parse(fs.readFileSync(fileName, "utf-8"));
}

app.use("/jquery", express.static(path.join(__dirname, "node_modules/jquery/dist")));
app.use(express.static("public"));
 
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

http.listen(port, () => {
   console.log(`App server is running on port ${port}`);
});

io.on("connection", (socket) => {
    socket.on("new-user", (uuid, username) => {
        data = getFile();
        data.users[uuid] = {"name": username, "rooms": []};
        fs.writeFile(fileName, JSON.stringify(data), "utf8", () => {
            socket.emit("new-user-confirm");
        });
    });
    socket.on("get-rooms", (uuid) => {
        socket.emit("get-rooms", getFile().users[uuid].rooms);
    });
    socket.on("try-add-room", (userID, id) => {
        data = getFile();
        if (id in data.rooms) {
            data.users[userID].rooms.push(id);
            fs.writeFile(fileName, JSON.stringify(data), "utf8", () => {
                socket.emit("new-user-confirm");
            });
            socket.emit("try-add-room", true);
        } else {
            socket.emit("try-add-room", false);
        }
    })
    socket.on("create-room", (userID, id) => {
        data = getFile();
        data.rooms[id] = [];
        data.users[userID].rooms.push(id);
        fs.writeFile(fileName, JSON.stringify(data), "utf8", () => {
            socket.emit("create-room-confirm");
        });
    });
});