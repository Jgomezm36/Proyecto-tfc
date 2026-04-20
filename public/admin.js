const socket = io();
const list = document.getElementById('admin-list');
const form = document.getElementById('add-form');

function loadDestinos() {
    fetch('/api/destinos')
        .then(res => res.json())
        .then(res => {
            list.innerHTML = '';
            res.data.forEach(d => {
                const li = document.createElement('li');
                li.innerHTML = `${d.nombre} (${d.precio}€) <button class="delete-btn" onclick="borrar(${d.id})">Borrar</button>`;
                list.appendChild(li);
            });
        });
}

window.borrar = (id) => {
    if(confirm('¿Borrar destino?')) {
        fetch(`/api/destinos/${id}`, { method: 'DELETE' });
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        nombre: document.getElementById('new-name').value,
        precio: document.getElementById('new-price').value,
        lat: document.getElementById('new-lat').value,
        lng: document.getElementById('new-lng').value
    };

    fetch('/api/destinos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(() => {
        form.reset();
        alert('Destino guardado. El cliente lo verá al instante.');
    });
});

// Sockets: Actualizar lista si hay cambios
socket.on('actualizar_destinos', loadDestinos);
loadDestinos();

// --- LÓGICA DEL CHAT CHÓFER ---
function enviarMensaje() {
    const input = document.getElementById('chat-input');
    if(input.value.trim() !== "") {
        socket.emit('mensaje_chat', { emisor: 'chofer', texto: input.value });
        input.value = '';
    }
}

socket.on('mensaje_chat', (data) => {
    const box = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.classList.add('message', data.emisor === 'chofer' ? 'msg-cliente' : 'msg-chofer'); // Invertido visualmente para el chofer
    div.innerHTML = `<b>${data.emisor === 'chofer' ? 'Tú' : 'Cliente'}:</b> ${data.texto}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
});