import fs from 'fs/promises';

export default class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.id = 1;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                const lastProduct = this.products[this.products.length - 1];
                this.id = lastProduct.id + 1;
            }
        } catch (error) {
            console.log('Error al leer el archivo de productos:', error);
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.log('Error al guardar el archivo de productos:', error);
        }
    }

    async addProduct(product) {
        await this.loadProducts(); // Cargar productos actualizados
        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            !product.stock
        ) {
            console.log('Todos los campos son obligatorios');
            return;
        }

        if (this.products.some((p) => p.code === product.code)) {
            console.log('Ya existe un producto con ese código');
            return;
        }

        product.id = this.id++;
        this.products.push(product);
        await this.saveProducts();
        console.log(`Producto agregado correctamente ${product.title}, su id es: ${product.id}`);
    }

    async getProducts() {
        await this.loadProducts(); // Cargar productos actualizados
        return this.products;
    }

    async getProductById(id) {
        await this.loadProducts(); // Cargar productos actualizados
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            console.log('Producto no encontrado');
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        await this.loadProducts(); // Cargar productos actualizados
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            console.log('Producto no encontrado');
            return;
        }
        const updatedProduct = { ...this.products[productIndex], ...updatedFields };
        this.products[productIndex] = updatedProduct;
        await this.saveProducts();
        console.log('Producto actualizado correctamente');
    }

    async deleteProduct(id) {
        await this.loadProducts(); // Cargar productos actualizados
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            console.log('Producto no encontrado');
            return;
        }
        this.products.splice(productIndex, 1);
        await this.saveProducts();
        console.log('Producto eliminado correctamente');
    }
}

// const productManager = new ProductManager('./productos.json');

// getProducts - Debe devolver un arreglo vacío
// console.log(productManager.getProducts()); // []

// addProduct - Agregar un nuevo producto
// productManager.addProduct({
//     title: 'Asado de tira',
//     description: 'Corte de carne de vaca',
//     price: 300,
//     thumbnail: 'Sin imagen',
//     code: 'ASADO',
//     stock: 100,
// });

// // getProducts - El producto recién agregado debe aparecer
// console.log(productManager.getProducts());

// // getProductById - Obtener producto por id (existente)
// const productId = 1; // Id del producto recién agregado
// console.log(productManager.getProductById(productId));

// // getProductById - Obtener producto por id (no existente)
// const nonExistingId = 3;
// console.log(productManager.getProductById(nonExistingId)); // Producto no encontrado

// updateProduct - Actualizar un campo del producto
// const updatedFields = {
//     price: 300, // Actualizar el precio
//     description: "Producto actualizado", // Actualizar la descripción
// };
// const productId = 1; // Id del producto a actualizar
// productManager.updateProduct(productId, updatedFields);

// // getProducts - El producto actualizado debe aparecer
// console.log(productManager.getProducts());

// // deleteProduct - Eliminar producto
// const productId = 1; // Id del producto a eliminar
// productManager.deleteProduct(productId);

// getProducts - El producto eliminado ya no debe aparecer
// console.log(ProductManager.getProducts());
