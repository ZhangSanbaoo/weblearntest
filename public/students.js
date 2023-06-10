
document.addEventListener("DOMContentLoaded", function (event) {
var link = document.createElement("a");
link.setAttribute("href", "/students/create");
link.textContent = "Create Student";

var testButton = document.querySelector("#test");
testButton.addEventListener("click", function() {
    alert("CLICKED!");
});

var list = document.getElementsByTagName("ul")[0];
list.appendChild(link);
});


