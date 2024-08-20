let estado = false
let intervalo = 5000
let intervaloId = null
let devagar = 10000
let padrao = 5000
let rapido = 2000
let removedTabs = []
let notReloadTabs = []
let intervalos = {}

function updateInterval(novoIntervalo){
    if(novoIntervalo >0){
        intervalo = novoIntervalo
    }
}

function updateEstado(novoEstado){
    if(typeof novoEstado === Boolean){
        estado = novoEstado
    }
}
function inverteEstado(){
    estado = !estado
}

function iniciaPara(novoIntervalo){
    clearInterval(intervaloId)
    console.log(novoIntervalo)
    console.log('troca de intervalo')
    if(estado){
        intervaloId = setInterval(carossel, novoIntervalo)
    }
}

function intervaloDiff(intervalodif){
    clearInterval(intervaloId)
    console.log('intervalo especial')
    if(estado){
        intervaloId = setInterval(carossel,intervalodif)
    }
}



function carossel(){
    if(!estado) return
    browser.tabs.query({}, (tabs)=>{
        if(tabs.length === 0) return
        browser.tabs.query({active: true}, async (tabrs)=>{
            console.log(tabrs[0].index)
            index = tabrs[0].index
            console.log(intervalos[(index+1)%tabs.length])
            if(intervaloId != null){
                clearInterval(intervaloId)
            }
            aleatorio = parseInt(Math.random() * 2) 
            browser.tabs.create({
                active : true,
                url : `./chamadas/chamada${aleatorio}.html`
            })
            await new Promise(res => setTimeout(res, 15000))
            //adiciona transição
            if(intervalos[(index+1)%tabs.length] !== undefined){
                console.log(intervalos[(index+1)%tabs.length])
                iniciaPara(intervalos[(index+1)%tabs.length])
                console.log(intervalos[(index+1)%tabs.length])
            }
            else{
                iniciaPara(intervalo)
            }
           if(removedTabs.includes(index+1))
            {   
                while(removedTabs.includes(index+1)){
                    index = (index + 1) % tabs.length
                }
            }
            index = (index + 1) % tabs.length

            browser.tabs.update(tabs[index].id, {active: true})
            browser.tabs.executeScript({file: "./scripttransicao.js"})
            if(!notReloadTabs.includes((((index-1)% tabs.length)+tabs.length)%tabs.length)){
                browser.tabs.reload(tabs[(((index-1)% tabs.length)+tabs.length)%tabs.length].id)
            }
            browser.tabs.query({}, (tabs)=>{
                browser.tabs.remove(tabs[tabs.length-1].id)
            })
        })
    })

    
}

function transformaintervalo(index){
    minutos = 0
    segundos = 0
    if(intervalos[index] !== undefined){
        intervalocerto = intervalos[index] / 1000
        minutos = parseInt(intervalocerto/60)
        segundos = parseInt(intervalocerto%60)
    }
    console.log([minutos,segundos])
    return [minutos,segundos]
}


browser.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    
    if(request.action === 'start/stop'){
        inverteEstado()
        iniciaPara(intervalo)
        sendResponse({estado})
    }
    else if(request.action === 'getEstado'){
        sendResponse({estado})
    }
    else if(request.action === 'getIntervalo'){
        sendResponse({intervalo})
    }
    else if(request.action === 'getAll'){
        sendResponse({estado, intervalo})
    }
    else if(request.action === 'setEstado'){
        inverteEstado()
        sendResponse(estado ? 'mudado para ligado' : 'mudado para desligado')
    }
    else if(request.action === 'setVelocidadeDevagar'){
        iniciaPara(devagar)
        sendResponse('trocou')
    }
    else if(request.action === 'setVelocidadePadrao'){
        iniciaPara(padrao)
        sendResponse('trocou')
    }
    else if(request.action === 'setVelocidadeRapida'){
        iniciaPara(rapido)
        sendResponse('trocou')
    }
    else if(request.action === 'setVelocidadeCustom'){
        intervalo = request.message * 1000
        iniciaPara(intervalo)
        sendResponse('trocou')
    }
    else if(request.action === 'remove'){
        removedTabs.push(parseInt(request.message))
        sendResponse(`guia numero ${request.message} removida`)
        console.log(removedTabs)
    }
    else if(request.action === 'restore'){
        removedTabs.pop(parseInt(request.message))
        sendResponse(`guia de numero ${request.message} restaurada`)
        console.log(removedTabs)
    }
    else if(request.action === 'stopReload'){
        notReloadTabs.push(parseInt(request.message))
        sendResponse(`guia de numero ${request.message} nao sera recarregada`)
    }
    else if(request.action === 'startReload'){
        notReloadTabs.pop(parseInt(request.message))
        sendResponse(`guia de numero ${request.message} sera recarregada`)
    }
    else if(request.action === 'getIntervalos'){
        sendResponse(intervalos)
    }
    else if(request.action === 'getIntervalom'){
        intervalo = transformaintervalo(request.message)
        minutos = intervalo[0]
        segundos = intervalo[1]
        sendResponse({minutos: minutos, segundos: segundos})
    }
    else if(request.action === 'setIntervalos'){
        if(request.intervalo != null){
            intervalos[request.index] = request.intervalo
            sendResponse('intervalo definido')
        }
        else{
            sendResponse('intervalo inválido')
        }
        console.log(request.index)
        console.log(intervalos)
        console.log(intervalos[request.index])
    }
    else if(request.action === 'getVisibilidade'){
        sendResponse({removedTabs})
    }
    else if(request.action === 'getReload'){
        sendResponse({notReloadTabs})
    }
    else if(request.action === 'teste'){
        console.log("teste")
    }

    return
})