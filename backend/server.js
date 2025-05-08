const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());

// URI para producción (Railway) o fallback local (desarrollo)
const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "supermercado";

// Ruta para probar que el backend funciona
app.get("/", (req, res) => {
    res.send("✅ Backend de Supermercados Acosta está activo.");
});

// Ruta principal de productos
app.get("/productos", async (req, res) => {
    try {
        console.log("Conectando a MongoDB en:", uri);
        await client.connect();
        const db = client.db(dbName);
        const productos = await db.collection("productos").find().toArray();
        res.json(productos);
    } catch (err) {
        console.error("Error al conectar con MongoDB:", err);
        res.status(500).send("Error al conectar con MongoDB");
    }
});

// Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor levantado en el puerto ${PORT}`);
});
