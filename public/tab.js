
tabOpened = false;

$("#show-hide-rooms").on("click", () => {

    const tab = $("#rooms");
    const header = $("header");

    tabOpened = ! tabOpened;
    if (tabOpened) {
        tab.css("transform", "translateX(0px)");
        header.css("left", "500px");
    } else {
        tab.css("transform", "translateX(-500px)");
        header.css("left", "0");
    }
});