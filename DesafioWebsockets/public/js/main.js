const socket = io.connect();

const addProduct = document.getElementById('addProduct')
addProduct.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: addProduct[0].value,
        price: addProduct[1].value,
        thumbnail: addProduct[2].value
    }
    socket.emit('update', producto);
    addProduct.reset()
})

socket.on('products', productos => {
    makeHtmlTable(productos).then(html => {
        document.getElementById('productos').innerHTML = html
    })
});

function makeHtmlTable(productos) {
    return fetch('views/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const sendMessage = document.getElementById('sendMessage')
sendMessage.addEventListener('submit', e => {
    e.preventDefault()

    const mensaje = { autor: inputUsername.value, texto: inputMensaje.value }
    socket.emit('newMessage', mensaje);
    sendMessage.reset()
    inputMensaje.focus()
})

socket.on('messages', messages => {
    const html = makeHtmlList(messages)
    document.getElementById('messages').innerHTML = html;
})

function makeHtmlList(messages) {
    return messages.map(mensaje => {
        return (`
            <div>
                <b style="color:blue;">${mensaje.autor}</b>
                [<span style="color:brown;">${mensaje.fyh}</span>] :
                <i style="color:green;">${mensaje.texto}</i>
            </div>
        `)
    }).join(" ");
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})
