// ✅ server.js COMPLETO ACTUALIZADO CON CRUD DE PRODUCTOS
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

// ✅ Servir archivos estáticos desde /fronted
app.use(express.static(path.join(__dirname, "..", "fronted")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "fronted", "index.html"));
});

const allowedOrigins = [
  "https://tfc-1.onrender.com",
  "https://tfc-2gv2.onrender.com",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:3001",
  "http://localhost:4000"
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

const uri = process.env.MONGO_URL;
if (!uri) {
  console.error("❌ ERROR: No se ha definido MONGO_URL en el entorno.");
  process.exit(1);
}
const client = new MongoClient(uri);
const dbName = "supermercado";

// ✅ Obtener productos paginados
app.get("/productos", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    await client.connect();
    const db = client.db(dbName);
    const productosCollection = db.collection("producto");
    const total = await productosCollection.countDocuments();
    const productos = await productosCollection.find().skip(skip).limit(limit).toArray();
    res.json({ total, productos });
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).send("Error al obtener productos");
  }
});

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

    res.json({ message: "Login exitoso", email, rol: usuario.rol || "cliente" });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error al procesar login" });
  }
});

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

app.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, oferta, novedad, precioOriginal, imagen } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const productos = db.collection("producto");

    await productos.updateOne(
      { _id: new ObjectId(id) },
      { $set: { nombre, descripcion, precio, oferta, novedad, precioOriginal, imagen } }
    );

    res.json({ message: "Producto actualizado" });
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
});

app.delete("/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const db = client.db(dbName);
    const productos = db.collection("producto");
    const resultado = await productos.deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
});

app.post("/productos", async (req, res) => {
  const { nombre, descripcion, precio, oferta, novedad, precioOriginal, imagen, categoria } = req.body;
  try {
    await client.connect();
    const db = client.db(dbName);
    const productos = db.collection("producto");

    await productos.insertOne({ nombre, descripcion, precio, oferta, novedad, precioOriginal, imagen, categoria });

    res.status(201).json({ message: "Producto creado correctamente" });
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ message: "Error al crear producto" });
  }
});

// ✅ Redirección para rutas no manejadas
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "fronted", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor levantado en el puerto ${PORT}`);
});