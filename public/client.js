
const socket = io();

if (Cookies.get("name") != undefined) {
    $("#ask-name").remove();
}
$("#ask-name-form").on("submit", (e) => {
    e.preventDefault();

    Cookies.set("name", $("#name").val().replace(" ", "-"));
    $("#ask-name").css("opacity", 0);
    setTimeout(() => {
        $("#ask-name").remove();
    }, 500);
});