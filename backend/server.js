const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());

// URI para conectar desde otro contenedor (no desde el host)
const uri = process.env.MONGO_URL || "mongodb://mongodb:27017";
const client = new MongoClient(uri);
const dbName = "supermercado";

app.get("/productos", async (req, res) => {
    try {
        console.log("Conectando a MongoDB en:", uri); // Log útil para depuración
        await client.connect();
        const db = client.db(dbName);
        const productos = await db.collection("productos").find().toArray();
        res.json(productos);
    } catch (err) {
        console.error("Error al conectar con MongoDB:", err);
        res.status(500).send("Error al conectar con MongoDB");
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
