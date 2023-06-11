document.addEventListener("DOMContentLoaded", function (event) {
    var container = document.createElement("div");
    container.style.display = "grid";
    container.style.placeItems = "center";
    
    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.textContent = "Create Student";
    button.classList.add("red"); // 添加 red 类名
    
    button.addEventListener("click", function() {
      window.location.href = "/students/create";
    });
    
    container.appendChild(button);
    
    var list = document.getElementsByTagName("ul")[0];
    list.appendChild(container);
    
    var testButton = document.querySelector("#test");
    testButton.addEventListener("click", function() {
      alert("CLICKED!");
    });
  });
  