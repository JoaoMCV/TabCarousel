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
    intervalo= novoIntervalo
    clearInterval(intervaloId)
    console.log('troca de intervalo')
    if(estado){
        intervaloId = setInterval(carossel, intervalo)
    }
}

function intervaloDiff(intervalodif){
    clearInterval(intervaloId)
    console.log('intervalo especial')
    if(estado){
        intervaloID = setInterval(carossel,intervalodif)
    }
}

function carossel(){
    if(!estado) return
    chrome.tabs.query({}, (tabs)=>{
        if(tabs.length === 0) return
        chrome.tabs.query({active: true}, (tabrs)=>{
            console.log(tabrs[0].index)
            index = tabrs[0].index
           if(removedTabs.includes(index+1))
            {   
                while(removedTabs.includes(index+1)){
                    index = (index + 1) % tabs.length
                }
            }
            index = (index + 1) % tabs.length
            chrome.tabs.update(tabs[index].id, {active: true})
            if(!notReloadTabs.includes(index - 1)){
                if(index !=0){
                    chrome.tabs.reload(tabs[(index - 1)%tabs.length].id)
                }
                else{
                    chrome.tabs.reload(tabs[tabs.length - 1].id)
                }
            }
            
        })
    })
    
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    
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
        removedTabs.push(request.message)
        sendResponse(`guia numero ${request.message} removida`)
    }
    else if(request.action === 'restore'){
        removedTabs.pop(request.message)
        sendResponse(`guia de numero ${request.message} restaurada`)
    }
    else if(request.action === 'stopReload'){
        notReloadTabs.push(request.message)
        sendResponse(`guia de numero ${request.message} nao sera recarregada`)
    }
    else if(request.action === 'startReload'){
        notReloadTabs.pop(request.message)
        sendResponse(`guia de numero ${request.message} sera recarregada`)
    }
    else if(request.action === 'getIntervalos'){
        sendResponse(intervalos)
    }
    else if(request.action === 'setIntervalos'){
        if(request.intervalo != null){
            intervalos[request.index] = request.intervalo
            sendResponse('intervalo definido')
        }
        else{
            sendResponse('intervalo inválido')
        }
        console.log(intervalos)
    }

    return
})