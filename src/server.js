import express from 'express';
import ProductManager from './components/ProductManager.js';

const PORT = 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager('./productos.json');
const allproducts = productManager.getProducts();

app.get("/products", async (req, res) => {
    let limit = parseInt(req.query.limit);
    if(!limit) return res.send(await productManager.getProducts());
    let allproducts = await productManager.getProducts();
    let productLimit = allproducts.slice(0, limit);
    res.send(productLimit);
});

app.get("/products/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let allproducts = await productManager.getProducts();
    let productById = allproducts.find((p) => p.id === id);
    res.send(productById);
});

const server = app.listen(PORT, () => {
    console.log(`Express por local Host ${server.address().port}`)
});
server.on("error", error => console.log(`Error en servidor ${error}`));