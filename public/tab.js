
tabOpened = false;

$("#show-hide-rooms").on("click", () => {

    const tab = $("#rooms");
    const header = $("header");

    tabOpened = ! tabOpened;
    if (tabOpened) {
        tab.css("transform", "translateX(0px)");
    } else {
        tab.css("transform", "translateX(-250px)");
    }
});

function editRoomNameEND(id) {
    let newName = $(`#room-name-${id}`).val();
    if (newName == "") newName = id;
    console.log("unfocus avec l'ID '" + id + "' et avec le nom '" + newName + "'");
    $(`#room-name-${id}`).replaceWith(function () {
        return $(`<p id="room-name-${id}" onclick="editRoomName('${id}')">${newName}</p>`);
    });
    Cookies.set(id, newName);
}

function editRoomName(id) {
    const name = $(`#room-name-${id}`).text();
    $(`#room-name-${id}`).replaceWith(function () {
        return $(`<input onfocusout="editRoomNameEND('${id}')" type="text" placeholder="${name}" id="room-name-${id}" minlength="1" required">`);
    });
}