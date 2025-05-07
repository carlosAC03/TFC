const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "supermercado";

app.get("/productos", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const productos = await db.collection("productos").find().toArray();
        res.json(productos);
    } catch (err) {
        res.status(500).send("Error al conectar con MongoDB");
    }
});

app.listen(3000, () => {
    console.log("Servidor en http://localhost:4000");
});
