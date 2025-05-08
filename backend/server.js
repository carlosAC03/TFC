const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

// Configurar CORS para aceptar peticiones desde tu frontend
app.use(cors({
  origin: "https://tfc-1.onrender.com" // Cambia si tu frontend tiene otra URL
}));

// Conexión a MongoDB Atlas o local
const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "supermercado";

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ Backend de Supermercados Acosta está activo.");
});

// Ruta para obtener productos
app.get("/productos", async (req, res) => {
  try {
    console.log("Conectando a MongoDB en:", uri);
    await client.connect();
    const db = client.db(dbName);
    const productos = await db.collection("producto").find().toArray();
    res.json(productos);
  } catch (err) {
    console.error("Error al conectar con MongoDB:", err);
    res.status(500).send("Error al conectar con MongoDB");
  }
});

// ✅ Usar el puerto que Render asigna automáticamente
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor levantado en el puerto ${PORT}`);
});
