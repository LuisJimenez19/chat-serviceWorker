console.log("holis SW")
// En el service worker, escuchamos por mensajes y los reenviar a todas las pestañas
self.addEventListener('message', event => {

    self.clients.matchAll().then(clients => {

        clients.forEach(client => {

            /* No se envia al mismo cliente que lo redacta */
            if (client.id !== event.source.id) {
                client.postMessage(event.data);
            }
        });
    });
});

