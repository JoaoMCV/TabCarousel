let index = 0
let estado = false
let intervalo = 5000
let intervaloId = null
let devagar = 10000
let padrao = 5000
let rapido = 2000
let removedTabs

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

function carossel(){
    if(!estado) return
    chrome.tabs.query({}, (tabs)=>{
        if(tabs.length === 0) return
        console.log(tabs[index].id)
        teste = chrome.tabs.getCurrent()
        console.log(teste.index)
        index = (index + 1) % tabs.length
        if(tabs[index].url == "https://app.powerbi.com/groups/14e1c07d-28c2-4a27-9eff-ae2fcf99de7b/reports/ea788506-3fcf-4210-947c-ac65f330b1ba/ReportSection?experience=power-bi"){
            }
            else{
                chrome.tabs.reload(tabs[index].id)
            }
        chrome.tabs.update(tabs[index].id, {active: true})
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

    return
})