optionsbody = document.getElementById('optionsbody')
listaguias = document.getElementById('listaguiasopcoes')
let intervaloAtual
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

function iniciaListaopcoes(){
    chrome.tabs.query({}, (tabs)=>{
        chrome.runtime.sendMessage({action:'getIntervalo'}, (response)=>{
            intervaloAtual = response.intervalo
            console.log(response.intervalo)
        
            for(let i = 0; i< tabs.length;i++){
                itemObj = document.createElement('li')
        
                btnObj = document.createElement('BUTTON')
                
                btn2Obj = document.createElement('BUTTON')
                
                inputObj = document.createElement('input')
                inputObj.classList.add('numberinput')
                inputObj.classList.add(`${i}`)
                
                
                btnImg = document.createElement('img')
                btnImg.classList.add('btnImgVis')
                
                btn2Img = document.createElement('img')
                btn2Img.classList.add('reload')
                
                itemObj.textContent = tabs[i].title
                itemObj.appendChild(document.createElement('br'))
                itemObj.appendChild(inputObj)
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
                itemObj.setAttribute('data-intervalo', `${intervaloAtual}`)
                listaguias.appendChild(itemObj)
            }
        })
    })
}

optionsbody.onload = ()=>{
    iniciaListaopcoes()
}