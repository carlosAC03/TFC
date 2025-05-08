const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());

const uri = process.env.MONGO_URL || "mongodb://localhost:27017"; // URI dinámica para Docker/local
const client = new MongoClient(uri);
const dbName = "supermercado";

// Ruta de prueba para obtener productos
app.get("/productos", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const productos = await db.collection("productos").find().toArray();
        res.json(productos);
    } catch (err) {
        console.error("Error al conectar con MongoDB:", err);
        res.status(500).send("Error al conectar con MongoDB");
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
