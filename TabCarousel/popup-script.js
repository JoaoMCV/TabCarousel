botao = document.getElementById('startstop')
speedSelectDevagar = document.getElementById('devagar')
speedSelectRapido = document.getElementById('rapido')
speedSelectPadrao = document.getElementById('padrao')
input = document.getElementById('custom')
inputSetBtn = document.getElementById('customset')
extensaobody = document.getElementById('mainbody')
listaDeGuias = document.getElementById('listaDeGuias')

function updateButton(estadoAtual){
    
    if(estadoAtual){
        botao.textContent = 'Parar'
        botao.classList.add('ligado')
        botao.classList.remove('desligado')
    }
    else{
        botao.textContent = 'Começar'
        botao.classList.add('desligado')
        botao.classList.remove('ligado')        
    }
}

function iniciaLista(){
    chrome.tabs.query({}, (tabs)=>{
        for(let i = 0; i< tabs.length;i++){
            itemName = tabs[i].title
            itemObj = document.createElement('li')
            itemObj.textContent = itemName
            itemObj.classList.add('itemdaLista')
            listaDeGuias.appendChild(itemObj)
        }
    })
}

extensaobody.onload = ()=>{
    chrome.runtime.sendMessage({action: 'getEstado'}, (response)=>{
        updateButton(response.estado)
        console.log(response.estado)
    })
    iniciaLista()
}


inputSetBtn.addEventListener('click', ()=>{
    chrome.runtime.sendMessage({action: 'setVelocidadeCustom', message: input.value}, ()=>{
        console.log('Intervalo alterado para' + input.value + 'segundos')
    })
})

botao.addEventListener('click', ()=>{
    chrome.runtime.sendMessage({action: 'start/stop'},(response)=>{
        console.log(response.estado)
        updateButton(response.estado)
    })
})

speedSelectDevagar.addEventListener('click', ()=>{
    chrome.runtime.sendMessage({action: 'setVelocidadeDevagar'}, ()=>{
        console.log('Intervalo alterado para devagar (10s)')
    })
})

speedSelectPadrao.addEventListener('click', ()=>{
    chrome.runtime.sendMessage({action: 'setVelocidadePadrao'}, ()=>{
        console.log('Intervalo alterado para Padrao (5s)')
    })
})

speedSelectRapido.addEventListener('click', ()=>{
    chrome.runtime.sendMessage({action: 'setVelocidadeRapida'}, ()=>{
        console.log('Intervalo alterado para Padrao (2s)')
    })
})

