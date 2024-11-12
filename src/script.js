const { invoke } = window.__TAURI__.core;
document.oncontextmenu = document.body.oncontextmenu = function() {return false;}
var cards = document.getElementsByClassName("cards")

var mainmenu = document.getElementById("content")

var helpmenu = document.getElementById("helpmenu")

var displayhelp = false



document.addEventListener("keydown", (e) => { 
    if (e.key == "q" || e.key == "Q") 
    {
        invoke("close")
    } 
    if (e.key == "m" || e.key == "M") 
    {
        invoke("minimize")
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
        invoke("toggle_devtools").then(() => {
            console.log("Can't do that :/")
        })
    } 
    if (e.ctrlKey == true && e.key == "i" || e.key == "I") 
    {
        let res = invoke("install").then((text) => {

            if (text == "installed") {
                cards[0].children[2].innerHTML = "Installed"
                cards[2].children[2].innerHTML = "Uninstall"
                setTimeout(() => {
                    cards[0].children[2].innerHTML = "Install"
                }, 5000)
            }
        })
    } 
    if (e.ctrlKey == true && e.key == "r" || e.key == "R") 
    {
        let res = invoke("repair").then((text) => {

            
            if (text == "repaired"){
                cards[1].children[2].innerHTML = "Repaired"
                setTimeout(() => {
                    cards[1].children[2].innerHTML = "Repair"
                }, 5000)
            }
            else{
                alert("Not installed, please install first!")
            }
        })
    } 
    if (e.ctrlKey == true && e.key == "u" || e.key == "U") 
    {
        let res = invoke("uninstall").then((text) => {

            if (text == "uninstalled"){
                cards[2].children[2].innerHTML = "Uninstalled"
                cards[0].children[2].innerHTML = "Install"
                setTimeout(() => {
                    cards[2].children[2].innerHTML = "Uninstall"
                }, 5000)
            }
        })
    } 

});

cards[0].addEventListener('click', () => {
    let res = invoke("install").then((text) => {

        if (text == "installed"){
            cards[0].children[2].innerHTML = "Installed"
            cards[2].children[2].innerHTML = "Uninstall"
            setTimeout(() => {
                cards[0].children[2].innerHTML = "Install"
            }, 5000)
        }
    })
})

cards[1].addEventListener('click', () => {
    let res = invoke("repair").then((text) => {

        if(text == "repaired"){
            cards[1].children[2].innerHTML = "Repaired"
            setTimeout(() => {
                cards[1].children[2].innerHTML = "Repair"
            }, 5000)
        }
        else{
            alert("Not installed, please install first!")
        }
    })
})

cards[2].addEventListener('click', () => {
    let res = invoke("uninstall").then((text) => {
        if(text == "uninstalled"){
            cards[2].children[2].innerHTML = "Uninstalled"
            cards[0].children[2].innerHTML = "Install"
            setTimeout(() => {
                cards[2].children[2].innerHTML = "Uninstall"
            }, 5000)
        }
    })
})