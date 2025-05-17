const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

// ✅ CORS: permitir peticiones desde el frontend desplegado
app.use(cors({
  origin: "https://tfc-1.onrender.com" // Reemplázalo si usas otro dominio para el frontend
}));

// 🔗 Conexión a MongoDB
const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "supermercado";

// 🌐 Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ Backend de Supermercados Acosta está activo.");
});

// 📦 Obtener productos
app.get("/productos", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const productos = await db.collection("producto").find().toArray();
    res.json(productos);
  } catch (err) {
    console.error("Error al conectar con MongoDB:", err);
    res.status(500).send("Error al conectar con MongoDB");
  }
});

// 🔐 Login de usuario
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    await client.connect();
    const db = client.db(dbName);
    const usuarios = db.collection("usuarios");

    const usuario = await usuarios.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    res.json({ message: "Login exitoso", email });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error al procesar login" });
  }
});

// 📝 Registro de usuario
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    await client.connect();
    const db = client.db(dbName);
    const usuarios = db.collection("usuarios");

    const existente = await usuarios.findOne({ email });
    if (existente) {
      return res.status(400).json({ message: "Usuario ya registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await usuarios.insertOne({ email, password: hashed });

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

// 🚀 Puerto dinámico (Render o local)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor levantado en el puerto ${PORT}`);
});