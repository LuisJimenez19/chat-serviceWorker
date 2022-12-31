"use strict"

/* hamburger */
const btnHamburger = document.querySelector('.hamburger--minus')
const main = document.querySelector('.main');

btnHamburger.addEventListener("click", (e) => {
    btnHamburger.classList.toggle("is-active")
    document.querySelector('.menu__configs').classList.toggle("is-active")

})


/*---------------------- config -----------*/

const selects = document.querySelectorAll('select')
/* Objeto que contiene los arrays con las opciones, servira para poder iterar y saber que tipo de clase hay que remplazar */
let optionsObj = { "f-family": [], "f-size": [] }

selects.forEach(select => {
    let options = [...select.options]
    options.forEach(option => {
        /* Agrega al objeto los valores */
        if (option.parentElement.id === "f-family") {
            optionsObj["f-family"].push(option.value)
        } else if (option.parentElement.id === "f-size") {
            optionsObj["f-size"].push(option.value)
        }

    })
    /* cuando cambia un select le doy la clase al main */
    select.addEventListener('change', e => {
        let indexOption = select.options[select.selectedIndex]
        let currentOption = indexOption.value
        replaceClass(currentOption)
    },)
})

// Itera el objeto quitando todas las clases y después solo agrega la requerida
function replaceClass(currentOption) {

    if (optionsObj["f-family"].includes(currentOption)) {
        optionsObj["f-family"].forEach(clas => {
            main.classList.remove(clas)
        })

    } else if (optionsObj["f-size"].includes(currentOption)) {
        optionsObj["f-size"].forEach(clas => {
            main.classList.remove(clas)
        })
    }
    main.classList.add(currentOption)

}

/* --------------elegir el fondo del chat-------------- */
const msgContainer = document.querySelector('.messages')


function autoScroll() {
    msgContainer.scrollTop = msgContainer.scrollHeight
}


const inputColorBg = document.querySelector('#back-color');
/* Agrega estilos en linea, quita la imagen y añade el fondo elegido */
inputColorBg.addEventListener("change", (e) => {
    msgContainer.style = `background-color:${e.target.value}; background-image: unset;`
})

/* background image */
const inputImageBg = document.querySelector("#back-image");
const reader = new FileReader()

inputImageBg.addEventListener('change', (e) => {
    const typeFile = inputImageBg.files[0].name;
    /* Reviso si es una imagen valida */
    if (typeFile.includes(".jpg") || typeFile.includes(".gif") || typeFile.includes(".png")) {

        reader.readAsDataURL(inputImageBg.files[0])

        reader.addEventListener("load", (event) => {
            let fileState = event.currentTarget;
            if (fileState.readyState == 2) {
                changeBg(fileState.result);
            }
        });
    } else {
        alert("Ingrese una imagen valida")
    }
})
/* funcion que cambia la imagen de fondo */
function changeBg(img) {
    msgContainer.style = `background-image: url(${img}); background-color: unset;`
}




/* <-------------------------funcionalidad Real Time Sw--------------------- */
/* instalamos el service worker */
navigator.serviceWorker.register("sw.js")



/* Cuando recibe mensaje los renderiza en el mismo evento */
navigator.serviceWorker.addEventListener("message", (e) => {

    let liMsg = document.createElement("li");
    liMsg.className = "msg-container received"
    // liMsg.setAttribute("data-aos", "zoom-in-right")

    liMsg.innerHTML = `<span class="name">${e.data.name}</span>
                                <p class="msg">${e.data.msg}</p>
                            <span class="date">${e.data.date}</span>`
    msgContainer.appendChild(liMsg)
    // liMsg.scrollIntoView({ behavior: "smooth" });
    autoScroll()


})

/* -------------Enviar el mensaje---------- */

const form = document.querySelector(".form");
const inputMsg = document.querySelector("#input-msg");
const inputName = document.querySelector("#name-usuario");
form.addEventListener("submit", e => {
    e.preventDefault()

    if (inputMsg.value === "") {
        alert("Ingresa un mensaje.")
    } else {
        let msg = inputMsg.value
        let name = inputName.value
        /* Enviamos el mensaje */
        senderMsg(name, msg)
        inputMsg.value = ""
    }
})


/* <---------------funcion que se encarga de enviar los mensajes y después llama a la función que renderiza los mensajes enviados---- */

function senderMsg(name, msg) {
    const date = new Date()
    const currentTime = date.toLocaleTimeString()
    const data = {
        name,
        msg,
        date: currentTime,

    }
    navigator.serviceWorker.controller.postMessage(data)
    renderMsgUser(data)
}

/* <--------------funcion que renderiza los mensajes propios del usuario-------- */

function renderMsgUser(obj) {
    let liMsg = document.createElement("li");
    liMsg.className = "msg-container send"

    liMsg.innerHTML = `<span class="name">${obj.name}</span>
                        <p class="msg">${obj.msg}</p>
                    <span class="date">${obj.date}</span>`
    msgContainer.appendChild(liMsg)
    // liMsg.scrollIntoView({ behavior: "smooth" });
    autoScroll()
}