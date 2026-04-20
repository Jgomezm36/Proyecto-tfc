const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./chofer.db', (err) => {
    if (err) console.error('Error al abrir la BD', err.message);
    else {
        console.log('Conectado a SQLite.');
        crearTabla();
    }
});

function crearTabla() {
    db.run(`CREATE TABLE IF NOT EXISTS destinos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        precio INTEGER,
        lat REAL,
        lng REAL
    )`, (err) => {
        if (!err) {
            db.get("SELECT count(*) as count FROM destinos", (err, row) => {
                if(row.count === 0) {
                    const insert = 'INSERT INTO destinos (nombre, precio, lat, lng) VALUES (?,?,?,?)';
                    db.run(insert, ["Aeropuerto Barajas", 30, 40.4983, -3.5676]);
                    db.run(insert, ["Estación de Atocha", 15, 40.4065, -3.6896]);
                    console.log("Datos iniciales insertados.");
                }
            });
        }
    });
}

module.exports = db;
