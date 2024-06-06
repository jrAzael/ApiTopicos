const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();
app.use(express.json());
app.use(cors());
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor creado en el puerto ${port}`);
});
const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    port: process.env.port,
    database: process.env.database
});
connection.connect((error) => {
    if (error) {
        throw error;
    }
    console.log('Conexión con la base de datos establecida');
});
app.get("/", (req, res) => {
    connection.query("SELECT * FROM registros", (error, results) => {
        if (error) res.status(500).json({ message: error.message || "No se pueden obtener datos en este momento para la tabla usuarios" });
        else res.status(200).json(results);
    });
});
app.post("/", (req, res) => {
    const { nombre } = req.body;
    connection.query('INSERT INTO registros (nombre) VALUES (?)', [nombre], (error, results) => {
        if (error) res.status(500).json({ message: error.message || "No se pudo insertar el dato en este momento" });
        else res.json(results);
    });
});

app.patch("/", (req, res) => {
    const { id, nombre } = req.body;
    connection.query(`UPDATE registros SET nombre=? WHERE id=?`, [nombre, id], (error, results) => {
        if (error) res.status(500).json({ message: error.message || "No se pudo actualizar en este momento" });
        else res.json(results);
    });
});

app.delete("/", (req, res) => {
    const { id } = req.body;
    connection.query(`DELETE FROM registros WHERE id=?`, [id], (error, results) => {
        if (error) res.status(500).json({ message: error.message || "No se pudo eliminar en este momento" });
        else res.json(results);
    });
});