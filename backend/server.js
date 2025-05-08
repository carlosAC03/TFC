const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

// Permitir solo peticiones desde tu frontend desplegado en Render
app.use(cors({
  origin: "https://tfc-1.onrender.com"
}));

// URI para producción o local
const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "supermercado";

// Ruta raíz
app.get("/", (req, res) => {
  res.send("✅ Backend de Supermercados Acosta está activo.");
});

// Ruta de productos
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

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor levantado en el puerto ${PORT}`);
});
