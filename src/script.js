var cards = document.getElementsByClassName("cards")

var closebutton = document.getElementById("closebutton")

document.addEventListener("keydown", (e) => { 
    if (e.key == "q" || e.key == "Q") 
    {
         window.ipcAPI.send("quit");
    } 
});

cards[0].addEventListener('click', () => {
    window.ipcAPI.send("install");
    window.ipcAPI.on("installed", (data) => {
        cards[0].children[2].innerHTML = "Installed"
        cards[2].children[2].innerHTML = "Uninstall"
        setTimeout(() => {
            cards[0].children[2].innerHTML = "Install"
        }, 5000)
    })
})

// closebutton.addEventListener("click", () => {
//     window.ipcAPI.send("quit")
// })

cards[1].addEventListener('click', () => {
    window.ipcAPI.send("repair");
    window.ipcAPI.on("repaired", (data) => {
        cards[1].children[2].innerHTML = "Repaired"
        setTimeout(() => {
            cards[1].children[2].innerHTML = "Repair"
        }, 5000)
    })
    window.ipcAPI.on("not-installed", (data) => {
        alert("Not installed, please install first!")
    })
})

cards[2].addEventListener('click', () => {
    window.ipcAPI.send("uninstall");
    window.ipcAPI.on("uninstalled", (data) => {
        cards[2].children[2].innerHTML = "Uninstalled"
        cards[0].children[2].innerHTML = "Install"
        setTimeout(() => {
            cards[2].children[2].innerHTML = "Uninstall"
        }, 5000)
    })
})