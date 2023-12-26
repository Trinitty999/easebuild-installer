var cards = document.getElementsByClassName("cards")

document.addEventListener("keydown", (e) => { if (e.key == "f") { alert("idk"); } });

cards[0].addEventListener('click', () => {
    alert("You clicked.");
    window.ipcAPI.send("install");
    window.ipcAPI.on("installed", (data) => {
        cards[0].children[2].innerHTML = "Installed"
    })
})

