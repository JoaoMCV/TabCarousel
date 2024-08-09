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

function atualizarReload(){
    imagem = this.children.item(0)
    if(imagem.classList.contains('reload')){
        imagem.classList.add('notreload')
        imagem.classList.remove('reload')
        chrome.runtime.sendMessage({action: 'stopReload', message: this.classList[1]}, ()=>{
            console.log(this.classList[1])
        })
    }
    else{
        imagem.classList.add('reload')
        imagem.classList.remove('notreload')
        chrome.runtime.sendMessage({action: 'startReload', message: this.classList[1]}, ()=>{
            console.log(this.classList[1])
        })
    }
}

function iniciaLista(){
    chrome.tabs.query({}, (tabs)=>{

        for(let i = 0; i< tabs.length;i++){
            
            itemName = tabs[i].title
            
            itemObj = document.createElement('li')
            
            btnObj = document.createElement('BUTTON')

            btn2Obj = document.createElement('BUTTON')
            
            let btnImg = document.createElement('img')
            
            chrome.runtime.sendMessage({action: 'getVisibilidade'}, (response)=>{
                invisibletabs = response.removedTabs
                if(invisibletabs.includes(i)){
                    console.log(i)
                    btnImg.classList.remove('btnImgVis')
                    btnImg.classList.add('btnImgnotVis')
                }
                else{
                    btnImg.classList.remove('btnImgnotVis')
                    btnImg.classList.add('btnImgVis')
                }
            })

            let btn2Img = document.createElement('img')
            chrome.runtime.sendMessage({action: 'getReload'}, (response)=>{
                notreload = response.notReloadTabs
                if(notreload.includes(i)){
                    btn2Img.classList.remove('reload')
                    btn2Img.classList.add('notreload')
                }
                else{
                    btn2Img.classList.remove('notreload')
                    btn2Img.classList.add('reload')
                }
            })            
            
            itemObj.textContent = itemName
            itemObj.appendChild(btnObj)
            itemObj.appendChild(btn2Obj)
            
            
            btnObj.classList.add('botaogeral')
            btnObj.classList.add(`${i}`)
            btnObj.appendChild(btnImg)
            btnObj.addEventListener('click', atualizarVisibilidade)

            btn2Obj.classList.add('botaogeral')
            btn2Obj.classList.add(`${i}`)
            btn2Obj.appendChild(btn2Img)
            btn2Obj.addEventListener('click', atualizarReload)

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
    speedSelectPadrao.classList.add('selecionado')
    speedSelectDevagar.classList.add('naoselecionado')
    speedSelectRapido.classList.add('naoselecionado')
    inputSetBtn.classList.add('naoselecionado')
}

inputSetBtn.addEventListener('click', ()=>{
    chrome.runtime.sendMessage({action: 'setVelocidadeCustom', message: input.value}, ()=>{
        console.log('Intervalo alterado para' + input.value + 'segundos')
    })
    speedSelectRapido.classList.remove('selecionado')
    speedSelectRapido.classList.add('naoselecionado')
    speedSelectPadrao.classList.remove('selecionado')
    speedSelectPadrao.classList.add('naoselecionado')
    speedSelectDevagar.classList.remove('selecionado')
    speedSelectDevagar.classList.add('naoselecionado')
    inputSetBtn.classList.remove('naoselecionado')
    inputSetBtn.classList.add('selecionado')   
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
    inputSetBtn.classList.remove('selecionado')
    inputSetBtn.classList.add('naoselecionado')
    speedSelectRapido.classList.remove('selecionado')
    speedSelectRapido.classList.add('naoselecionado')
    speedSelectPadrao.classList.remove('selecionado')
    speedSelectPadrao.classList.add('naoselecionado')
    speedSelectDevagar.classList.add('selecionado')
    speedSelectDevagar.classList.remove('naoselecionado')
    

})

speedSelectPadrao.addEventListener('click', ()=>{
    chrome.runtime.sendMessage({action: 'setVelocidadePadrao'}, ()=>{
        console.log('Intervalo alterado para Padrao (5s)')
    })
    inputSetBtn.classList.remove('selecionado')
    inputSetBtn.classList.add('naoselecionado')
    speedSelectRapido.classList.remove('selecionado')
    speedSelectRapido.classList.add('naoselecionado')
    speedSelectDevagar.classList.remove('selecionado')
    speedSelectDevagar.classList.add('naoselecionado')
    speedSelectPadrao.classList.add('selecionado')
    speedSelectPadrao.classList.remove('naoselecionado')
    

})

speedSelectRapido.addEventListener('click', ()=>{
    chrome.runtime.sendMessage({action: 'setVelocidadeRapida'}, ()=>{
        console.log('Intervalo alterado para Padrao (2s)')
    })
    inputSetBtn.classList.remove('selecionado')
    inputSetBtn.classList.add('naoselecionado')
    speedSelectDevagar.classList.remove('selecionado')
    speedSelectDevagar.classList.add('naoselecionado')
    speedSelectPadrao.classList.remove('selecionado')
    speedSelectPadrao.classList.add('naoselecionado')
    speedSelectRapido.classList.add('selecionado')
    speedSelectRapido.classList.remove('naoselecionado')
})

