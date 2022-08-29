
const socket = io();


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return undefined;
};

function randomID() {
    return Math.random().toString(36).substr(2, 9);
}


if (Cookies.get("name") != undefined && Cookies.get("uuid") != undefined) {
    $("#ask-name").remove();
    setup();
}
$("#ask-name-form").on("submit", (e) => {
    e.preventDefault();

    const username = $("#name").val();
    const uuid = randomID();

    Cookies.set("name", username.replace(" ", "-"));
    Cookies.set("uuid", uuid);
    $("#ask-name").css("opacity", 0);
    setTimeout(() => {
        $("#ask-name").remove();
    }, 500);

    socket.emit("new-user", uuid, username);
    socket.on("new-user-confirm", setup);
});

function setup() {

    socket.emit("get-rooms", Cookies.get("uuid"));
    socket.on("get-rooms", (data) => {
        if (data.length != 0) {
            $("#no-room").remove();
            for (i = 0; i < data.length; i++) {
                const id = data[i].room_id;
                const name = data[i].room_name;
                const addedRoom = `<div class="room" id="room-${id}">
                                        <img src="imgs/book.svg" onclick="window.location.href = window.location.origin + '/?room=${id}'">
                                        <p id="room-name-${id}" onclick="editRoomName('${id}')">${name}</p>
                                    </div>`;
                $(addedRoom).insertBefore($("#add-room"));
            }
        }
    });

    const roomID = getUrlParameter("room");
    if (roomID != undefined) {
        socket.emit("get-room-data", Cookies.get("uuid"), roomID);
        socket.on("get-room-data", (data) => {
            $("#room-title").text(data.roomName + " - " + data.roomID);
        });
    }

    socket.on("try-add-room", (good) => {
        if (good) document.location.reload(true);
    });

    socket.on("create-room-confirm", () => {
        document.location.reload(true);
    });

}


