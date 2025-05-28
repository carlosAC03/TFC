const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://tfc-1.onrender.com"
}));

const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "supermercado";

// 🌐 Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ Backend de Supermercados Acosta está activo.");
});

// 📦 Obtener productos con paginación
app.get("/productos", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    await client.connect();
    const db = client.db(dbName);
    const productosCollection = db.collection("producto");

    const total = await productosCollection.countDocuments();
    const productos = await productosCollection.find()
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({ total, productos });
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).send("Error al obtener productos");
  }
});

// 🛒 Ofertas y novedades (igual que antes)
app.get("/productos/ofertas", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const productos = await db.collection("producto").find({ oferta: true }).toArray();
    res.json(productos);
  } catch (err) {
    console.error("Error al obtener productos en oferta:", err);
    res.status(500).send("Error al obtener productos en oferta");
  }
});

app.get("/productos/novedades", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const productos = await db.collection("producto").find({ novedad: true }).toArray();
    res.json(productos);
  } catch (err) {
    console.error("Error al obtener novedades:", err);
    res.status(500).send("Error al obtener novedades");
  }
});

// 🔐 Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    await client.connect();
    const db = client.db(dbName);
    const usuarios = db.collection("usuarios");

    const usuario = await usuarios.findOne({ email });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) return res.status(401).json({ message: "Contraseña incorrecta" });

    res.json({ message: "Login exitoso", email });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error al procesar login" });
  }
});

// 📝 Registro
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    await client.connect();
    const db = client.db(dbName);
    const usuarios = db.collection("usuarios");

    const existente = await usuarios.findOne({ email });
    if (existente) return res.status(400).json({ message: "Usuario ya registrado" });

    const hashed = await bcrypt.hash(password, 10);
    await usuarios.insertOne({ email, password: hashed });

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor levantado en el puerto ${PORT}`);
});
