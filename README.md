# Trabajo de Fin de Grado: App Chófer Privado (Sprint Final)

Aplicación web full-stack para la gestión de viajes de un chófer privado. Permite seleccionar destinos predefinidos, elegir destinos personalizados mediante un mapa interactivo, y negociar tarifas en tiempo real mediante chat.

## Tecnologías Utilizadas
* **Backend:** Node.js, Express.
* **Base de Datos:** SQLite.
* **Tiempo Real:** Socket.io.
* **Frontend:** HTML5, CSS3, JavaScript Vainilla, API Fetch.
* **Geolocalización/Mapas:** Leaflet.js (OpenStreetMap).

## Requisitos Previos
* Node.js instalado en el sistema.

## Instrucciones de Instalación y Ejecución

1. Descomprimir el archivo `.zip`.
2. Abrir una terminal en el directorio raíz del proyecto.
3. Instalar las dependencias ejecutando el comando:
   \`\`\`bash
   npm install
   \`\`\`
4. Iniciar el servidor ejecutando:
   \`\`\`bash
   npm start
   \`\`\`
5. La terminal mostrará el mensaje: `Servidor completo corriendo en http://localhost:3000`.

## Guía de Uso (Flujo de Pruebas)

Para probar la comunicación bidireccional, se recomienda abrir **dos pestañas o ventanas del navegador**:

1. **Ventana 1 (Vista Cliente):** Abre `http://localhost:3000`
2. **Ventana 2 (Vista Chófer):** Abre `http://localhost:3000/admin.html`

**Pasos para simular el proceso completo:**
1. En la **Vista Cliente**, haz clic en cualquier parte del mapa que no tenga un marcador. 
2. Verás que el cuadro de chat se rellena automáticamente con las coordenadas de donde has hecho clic. Dale a "Enviar".
3. Ve a la **Vista Chófer**. Verás el mensaje del cliente en el panel de la derecha. Responde con un precio (Ej. "Ese viaje son 45€").
4. En el mismo panel del Chófer, usa el formulario de la izquierda ("Crear Viaje Acordado"). Copia las coordenadas que te envió el cliente, ponle un nombre ("Viaje Cliente") y el precio acordado (45). Pulsa Guardar.
5. Vuelve a la **Vista Cliente**. Verás que ha saltado una alerta indicando que la lista se ha actualizado. Si abres el desplegable, ¡el viaje acordado ya está disponible para seleccionarlo!
