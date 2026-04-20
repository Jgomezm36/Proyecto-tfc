const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./database.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Inicializar WebSockets

const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// --- API RESTful ---
app.get('/api/destinos', (req, res) => {
    db.all("SELECT * FROM destinos", [], (err, rows) => {
        if (err) return res.status(400).json({"error":err.message});
        res.json({"message":"success", "data":rows});
    });
});

app.post('/api/destinos', (req, res) => {
    const { nombre, precio, lat, lng } = req.body;
    const sql = "INSERT INTO destinos (nombre, precio, lat, lng) VALUES (?,?,?,?)";
    db.run(sql, [nombre, precio, lat, lng], function(err) {
        if (err) return res.status(400).json({"error": err.message});
        
        // ¡Magia de WebSockets! Avisamos a todos los clientes que hay un nuevo destino
        io.emit('actualizar_destinos'); 
        
        res.json({"message": "success", "id": this.lastID});
    });
});

app.delete('/api/destinos/:id', (req, res) => {
    const sql = "DELETE FROM destinos WHERE id = ?";
    db.run(sql, req.params.id, function(err) {
        if (err) return res.status(400).json({"error": err.message});
        io.emit('actualizar_destinos'); // Avisar de que se borró uno
        res.json({"message": "deleted", changes: this.changes});
    });
});

// --- CHAT EN TIEMPO REAL (SOCKET.IO) ---
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado al chat');

    socket.on('mensaje_chat', (data) => {
        // Reenviar el mensaje a todos (Cliente <-> Chófer)
        io.emit('mensaje_chat', data);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor completo corriendo en http://localhost:${PORT}`);
});
