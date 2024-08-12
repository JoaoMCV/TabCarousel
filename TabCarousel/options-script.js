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
    console.log(this.classList.item(1))
    seconds = this.parentElement.children.item(2)
    if(minuts == undefined && seconds == undefined){
        return
    }
    minuts.value = minuts.value ? minuts.value : 0 
    seconds.value = seconds.value ? seconds.value : 0
    console.log([parseInt(minuts.value), parseInt(seconds.value)])
    chrome.runtime.sendMessage({action:'setIntervalos', index: this.classList.item(1), intervalo: ((parseInt(minuts.value) * 60) + parseInt(seconds.value))*1000})
    
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
                
                let inputObj = document.createElement('input')
                inputObj.classList.add('numberinput')
                inputObj.classList.add(`${i}`)
                
                let inputMinObj = document.createElement('input')
                inputMinObj.classList.add('numberinput')
                inputMinObj.classList.add(`${i}`)
                
                chrome.runtime.sendMessage({action: 'getIntervalom', message: i},(response)=>{
                    console.log(`${response.minutos} minutos ${response.segundos} segundos`)
                    if(response.minutos > 0){
                        inputMinObj.setAttribute('placeholder', `${response.minutos} minutos`)
                    }
                    else{
                        inputMinObj.setAttribute('placeholder', `minutos`)
                    }
                    if(response.segundos > 0){
                        inputObj.setAttribute('placeholder', `${response.segundos} segundos`)
                    }
                    else{
                        inputObj.setAttribute('placeholder', `segundos`)
                    }
                })
                
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