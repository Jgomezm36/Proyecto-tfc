const socket = io(); // Conectar a WebSockets
const map = L.map('map').setView([40.4168, -3.7038], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let currentMarker = null;
let customMarker = null;

// Cargar destinos iniciales
function cargarDestinos() {
    fetch('/api/destinos')
        .then(res => res.json())
        .then(res => {
            const select = document.getElementById('destination-select');
            // Guardamos la opción seleccionada actualmente si existe
            const valorActual = select.value;
            
            select.innerHTML = '<option value="" disabled selected>Selecciona destino...</option>';
            res.data.forEach(d => {
                const option = document.createElement('option');
                option.value = JSON.stringify(d);
                option.textContent = d.nombre;
                select.appendChild(option);
            });

            // Intentar restaurar selección (útil cuando el chofer añade el viaje acordado)
            if(valorActual) select.value = valorActual;
        });
}

// Evento: Seleccionar destino del desplegable
document.getElementById('destination-select').addEventListener('change', (e) => {
    const data = JSON.parse(e.target.value);
    document.getElementById('price-value').textContent = `${data.precio}€`;
    document.getElementById('price-display').classList.remove('hidden');

    if (currentMarker) map.removeLayer(currentMarker);
    if (customMarker) map.removeLayer(customMarker);
    
    map.setView([data.lat, data.lng], 14);
    currentMarker = L.marker([data.lat, data.lng]).addTo(map).bindPopup(`<b>${data.nombre}</b><br>${data.precio}€`).openPopup();
});

// Evento: Clic en el mapa para destino personalizado
map.on('click', function(e) {
    const lat = e.latlng.lat.toFixed(4);
    const lng = e.latlng.lng.toFixed(4);

    if (customMarker) map.removeLayer(customMarker);
    customMarker = L.marker([lat, lng], {icon: L.icon({iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', iconSize: [25, 41], iconAnchor: [12, 41]})}).addTo(map);
    customMarker.bindPopup("Destino Personalizado.<br>Pregunta el precio por chat.").openPopup();

    // Rellenar el chat automáticamente
    const inputChat = document.getElementById('chat-input');
    inputChat.value = `Hola, quiero ir a las coordenadas Lat: ${lat}, Lng: ${lng}. ¿Qué precio tendría?`;
    inputChat.focus();
});

cargarDestinos();

// --- LÓGICA DEL CHAT ---
function enviarMensaje() {
    const input = document.getElementById('chat-input');
    if(input.value.trim() !== "") {
        socket.emit('mensaje_chat', { emisor: 'cliente', texto: input.value });
        input.value = '';
    }
}

socket.on('mensaje_chat', (data) => {
    const box = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.classList.add('message', data.emisor === 'cliente' ? 'msg-cliente' : 'msg-chofer');
    div.innerHTML = `<b>${data.emisor === 'cliente' ? 'Tú' : 'Chófer'}:</b> ${data.texto}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
});

// Escuchar si el chofer ha guardado un destino nuevo y actualizar el select en tiempo real
socket.on('actualizar_destinos', () => {
    cargarDestinos();
    alert("El chófer ha actualizado la lista de destinos disponibles.");
});
let originMarker = null; // Variable para el marcador de origen (donde está el cliente)

function localizarCliente() {
    // Comprobar si el navegador soporta geolocalización
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                // 1. Centrar el mapa en el cliente
                map.setView([lat, lng], 15);

                // 2. Colocar o mover el marcador de origen
                if (originMarker) map.removeLayer(originMarker);
                
                // Usamos un icono azul por defecto para el origen
                originMarker = L.marker([lat, lng]).addTo(map)
                    .bindPopup("<b>Estás aquí</b><br>Punto de recogida")
                    .openPopup();

                // 3. (Opcional) Enviar mensaje automático al chat para informar al chófer
                socket.emit('mensaje_chat', { 
                    emisor: 'cliente', 
                    texto: `📍 Mi ubicación de recogida es: https://www.google.com/maps?q=${lat},${lng}` 
                });
            },
            (error) => {
                alert("Error al obtener ubicación. Asegúrate de dar permisos en el navegador.");
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");
    }
}
