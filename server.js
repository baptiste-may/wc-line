
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

require('dotenv').config();

const mysql = require('mysql');
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to Database !");
});

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
        db.query(`INSERT INTO users VALUES ("${uuid}", "${username}")`, (err, res) => {
            if (err) throw err;
            socket.emit("new-user-confirm");
        });
    });
    socket.on("get-rooms", (uuid) => {
        db.query(`SELECT room_id, room_name FROM rooms WHERE uuid = "${uuid}"`, (err, res) => {
            if (err) throw err;
            socket.emit("get-rooms", res);
        })
    });
    socket.on("try-add-room", (userID, id) => {
        db.query(`SELECT room_id FROM rooms WHERE room_id = "${id}"`, (err, res) => {
            if (err) throw err;
            if (res.length != 0) { // IF HAS ROOM
                db.query(`INSERT INTO rooms VALUES ("${userID}", "${id}", "${id}")`, (err, res) => {
                    if (err) throw err;
                    socket.emit("new-user-confirm");
                });
                socket.emit("try-add-room", true);
            } else {
                socket.emit("try-add-room", false);
            }
        });
    })
    socket.on("create-room", (userID, id) => {
        db.query(`INSERT INTO rooms VALUES ("${userID}", "${id}", "${id}")`, (err, res) => {
            if (err) throw err;
            socket.emit("create-room-confirm");
        });
    });
    socket.on("edit-room-name", (userID, roomID, name) => {
        db.query(`UPDATE rooms SET room_name = "${name}" WHERE (uuid = "${userID}" AND room_id = "${roomID}")`, (err, res) => {
            if (err) throw err;
        });
    });
});