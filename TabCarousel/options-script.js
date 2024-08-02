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

function alteraIntervalo(){
    minuts = this.parentElement.children.item(1)
    console.log()
    seconds = this.parentElement.children.item(2)
    chrome.runtime.sendMessage({action:'setIntervalos', index: this.classList[1], intervalo: ((parseInt(minuts.value) * 60) + parseInt(seconds.value))*1000})
    
}

function iniciaListaopcoes(){
    chrome.tabs.query({}, (tabs)=>{
        chrome.runtime.sendMessage({action:'getIntervalo'}, (response)=>{
            intervaloAtual = response.intervalo
            console.log(intervaloAtual)
        
            for(let i = 0; i< tabs.length;i++){
                chrome.runtime.sendMessage({action: 'setIntervalo', message:intervaloAtual})

                itemObj = document.createElement('li')
        
                btnObj = document.createElement('BUTTON')
                
                btn2Obj = document.createElement('BUTTON')

                btnSetObj = document.createElement('BUTTON')
                
                inputObj = document.createElement('input')
                inputObj.setAttribute('placeholder','segundos')
                inputObj.classList.add('numberinput')
                inputObj.classList.add(`${i}`)

                inputMinObj = document.createElement('input')
                inputMinObj.setAttribute('placeholder', 'minutos')
                inputMinObj.classList.add('numberinput')
                inputMinObj.classList.add(`${i}`)
                
                
                btnImg = document.createElement('img')
                btnImg.classList.add('btnImgVis')
                
                btn2Img = document.createElement('img')
                btn2Img.classList.add('reload')

                btnSetImg = document.createElement('img')
                btnSetImg.classList.add('set')
                
                itemObj.textContent = tabs[i].title
                itemObj.appendChild(document.createElement('br'))
                itemObj.appendChild(inputMinObj)
                itemObj.appendChild(inputObj)
                itemObj.appendChild(btnObj)
                itemObj.appendChild(btn2Obj)
                itemObj.appendChild(btnSetObj)
                
                btnSetObj.classList.add('botaogeral')
                btnSetObj.classList.add(`${i}`)
                btnSetObj.appendChild(btnSetImg)
                btnSetObj.addEventListener('click', alteraIntervalo)
                
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

                listaguias.appendChild(itemObj)
            }
        })
    })
}

optionsbody.onload = ()=>{
    iniciaListaopcoes()
}