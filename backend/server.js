const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

app.use(cors({
  origin: ["https://tfc-1.onrender.com", "http://localhost:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "supermercado";

// Ruta base
app.get("/", (req, res) => {
  res.send("✅ Backend de Supermercados Acosta está activo.");
});

// Productos con paginación
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

// Novedades
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

// ✅ Guardar compra SOLO en la colección "compras"
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
  console.log(`Servidor levantado en el puerto ${PORT}`);
});
