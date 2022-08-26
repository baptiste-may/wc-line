
roomsTabOpened = false;

$("#show-hide-rooms").on("click", () => {

    const tab = $("#rooms");

    roomsTabOpened = ! roomsTabOpened;
    if (roomsTabOpened) {
        tab.css("transform", "translateX(0px)");
    } else {
        tab.css("transform", "translateX(-250px)");
    }
});

usersTabOpened = false;

$("#show-hide-users").on("click", () => {

    const tab = $("#users");

    usersTabOpened = ! usersTabOpened;
    if (usersTabOpened) {
        tab.css("transform", "translateX(0px)");
    } else {
        tab.css("transform", "translateX(250px)");
    }
});


function editRoomNameEND(id) {
    let newName = $(`#room-name-${id}`).val();
    if (newName == "") newName = id;
    $(`#room-name-${id}`).replaceWith(function () {
        return $(`<p id="room-name-${id}" onclick="editRoomName('${id}')">${newName}</p>`);
    });
    socket.emit("edit-room-name", Cookies.get("uuid"), id, newName);
}

function editRoomName(id) {
    const name = $(`#room-name-${id}`).text();
    $(`#room-name-${id}`).replaceWith(function () {
        return $(`<input onfocusout="editRoomNameEND('${id}')" type="text" placeholder="${name}" id="room-name-${id}" minlength="1" required">`);
    });
}


$("#add-room").on("click", () => {
    $("#new-room").css("display", "block");
    setTimeout(() => {
        $("#new-room-tab").css("transform", "translate(-50%, -50%) scale(1)");
        $("#new-room").css("opacity", 1);
    }, 1);
});
$("#close-new-room-tab").on("click", () => {
    $("#new-room-tab").css("transform", "translate(-50%, -50%) scale(0)");
    $("#new-room").css("opacity", 0);
    setTimeout(() => {
        $("#new-room").css("display", "none");
    }, 250);
});

$("#new-room-by-join").on("submit", (e) => {
    e.preventDefault();
    socket.emit("try-add-room", Cookies.get("uuid"), $("#new-room-by-join-id").val());
});

$("#new-room-by-create").on("submit", (e) => {
    e.preventDefault();
    socket.emit("create-room", Cookies.get("uuid"), randomID());
});