
const addCss = css => document.head.appendChild(document.createElement("style")).innerHTML=css;
addCss("./animacao.css")
cores = document.createElement("div")
for(let i = 0; i<8; i++){
    cores.appendChild(document.createElement("div"))
}
browser.runtime.sendMessage({action:'teste'})
cores.id = "animacaoDiv"
document.body.insertBefore(cores ,document.body.children[0])
while(cores.children !== undefined){
    for(let i = 0; i < 8; i++){
        if(cores.children[i]===undefined){
            continue
        }
        if(cores.children[i].attributes.height == 0){
            cores.childre[i].remove()
        }
    }
}
cores.remove()
document.head.lastChild.remove()