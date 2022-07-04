
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