// Cargar variables de entorno solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

// Servir archivos HTML desde la carpeta 'fronted/html'
app.use(express.static(path.join(__dirname, "fronted", "html")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "fronted", "html", "index.html"));
});

// Lista de orígenes permitidos para CORS
const allowedOrigins = [
  "https://tfc-1.onrender.com",
  "https://tfc-2gv2.onrender.com",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:3001"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS no permitido desde: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// URI de conexión a MongoDB Atlas
const uri = process.env.MONGO_URL;
if (!uri) {
  console.error(" ERROR: No se ha definido MONGO_URL en el entorno.");
  process.exit(1);
}
const client = new MongoClient(uri);
const dbName = "supermercado";

// Obtener productos
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

// Productos en oferta
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

// Productos nuevos
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

// Login
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

// Registro
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

// Guardar compra
app.post("/comprar", async (req, res) => {
  const { email, carrito } = req.body;
  try {
    await client.connect();
    const db = client.db(dbName);
    const compras = db.collection("compras");

    const productosComprados = Object.entries(carrito).map(([nombre, info]) => ({
      nombre,
      cantidad: info.cantidad,
      precio: info.precio
    }));

    await compras.insertOne({
      email,
      productos: productosComprados,
      fecha: new Date()
    });

    res.status(200).json({ message: "Compra registrada correctamente" });
  } catch (err) {
    console.error("Error al guardar compra:", err);
    res.status(500).json({ message: "Error al guardar compra" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor levantado en el puerto ${PORT}`);
});
