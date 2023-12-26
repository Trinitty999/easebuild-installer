var cards = document.getElementsByClassName("cards")

var closebutton = document.getElementById("closebutton")

cards[0].addEventListener('click', () => {
    window.ipcAPI.send("install");
    window.ipcAPI.on("installed", (data) => {
        cards[0].children[2].innerHTML = "Installed"
    })
})

// closebutton.addEventListener("click", () => {
//     window.ipcAPI.send("quit")
// })

cards[1].addEventListener('click', () => {
    window.ipcAPI.send("repair");
    window.ipcAPI.on("repaired", (data) => {
        cards[1].children[2].innerHTML = "Repaired"
    })
    window.ipcAPI.on("intact", (data) => {
        cards[1].children[2].innerHTML = "File is Intact"
    })
})

cards[2].addEventListener('click', () => {
    window.ipcAPI.send("uninstall");
    window.ipcAPI.on("uninstalled", (data) => {
        cards[2].children[2].innerHTML = "Uninstalled"
    })
})