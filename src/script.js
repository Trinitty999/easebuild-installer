var cards = document.getElementsByClassName("cards")

var mainmenu = document.getElementById("content")

var helpmenu = document.getElementById("helpmenu")

var displayhelp = false

document.addEventListener("keydown", (e) => { 
    if (e.key == "q" || e.key == "Q") 
    {
         window.ipcAPI.send("quit");
    } 
    if (e.key == "m" || e.key == "M") 
    {
         window.ipcAPI.send("minimize");
    } 
    if (e.key == "h" || e.key == "H") 
    {
        displayhelp = !displayhelp
        if(displayhelp){
            mainmenu.style.display = "none";
            helpmenu.style.display = "flex";    
        }
        else{
            mainmenu.style.display = "flex";
            helpmenu.style.display = "none";
        }
        
    } 
    if (e.altKey == true && e.key == "i") 
    {
         window.ipcAPI.send("toggle-devtools")
    } 
    if (e.altKey == true && e.key == "c") 
    {
         window.ipcAPI.send("clear-cache")
    } 
    if (e.ctrlKey == true && e.key == "i" || e.key == "I") 
    {
         window.ipcAPI.send("install");
         window.ipcAPI.on("installed", (data) => {
            cards[0].children[2].innerHTML = "Installed"
            cards[2].children[2].innerHTML = "Uninstall"
            setTimeout(() => {
                cards[0].children[2].innerHTML = "Install"
            }, 5000)
        })
    } 
    if (e.ctrlKey == true && e.key == "r" || e.key == "R") 
    {
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
    } 
    if (e.ctrlKey == true && e.key == "u" || e.key == "U") 
    {
        window.ipcAPI.send("uninstall");
        window.ipcAPI.on("uninstalled", (data) => {
            cards[2].children[2].innerHTML = "Uninstalled"
            cards[0].children[2].innerHTML = "Install"
            setTimeout(() => {
                cards[2].children[2].innerHTML = "Uninstall"
            }, 5000)
        })
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