botao = document.getElementById('startstop')
speedSelectDevagar = document.getElementById('devagar')
speedSelectRapido = document.getElementById('rapido')
speedSelectPadrao = document.getElementById('padrao')
input = document.getElementById('custom')
inputSetBtn = document.getElementById('customset')
extensaobody = document.getElementById('mainbody')
listaDeGuias = document.getElementById('listaDeGuias')
visBtns = document.getElementsByClassName('botaogeral')

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

function atualizarVisibilidade(){
    console.log(this.classList)
    imagem = this.children.item(0)
    if(imagem.classList.contains('btnImgVis')){
        imagem.classList.add('btnImgnotVis')
        imagem.classList.remove('btnImgVis')
        chrome.runtime.sendMessage({action: 'remove', message: this.classList[1]}, ()=>{
            console.log(this.classList[1])
        })
    }
    else{
        imagem.classList.add('btnImgVis')
        imagem.classList.remove('btnImgnotVis')
        chrome.runtime.sendMessage({action: 'restore', message: this.classList[1]}, ()=>{
            console.log(this.classList[1])
        })
    }


    console.log(imagem.classList)
}


function iniciaLista(){
    chrome.tabs.query({}, (tabs)=>{
        for(let i = 0; i< tabs.length;i++){
            
            itemName = tabs[i].title
            
            itemObj = document.createElement('li')
            
            btnObj = document.createElement('BUTTON')
            
            btnImg = document.createElement('img')
            btnImg.classList.add('btnImgVis')
            
            itemObj.textContent = itemName
            itemObj.appendChild(btnObj)
            
            
            btnObj.classList.add('botaogeral')
            btnObj.classList.add(`${i}`)
            btnObj.appendChild(btnImg)
            btnObj.addEventListener('click', atualizarVisibilidade)

            
            itemObj.classList.add('visivel')
            itemObj.classList.add(`itemdaLista`)
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

