const fs = require('fs');

class ProductManager {
    // El constructor recibe la ruta del archivo donde se guardarán los productos.
    constructor(filePath) {
        this.path = filePath;
        // Al crear una instancia de ProductManager, se leen los productos existentes desde el archivo.
        this.products = this.readProductsFromFile();
    }

    // Método para leer los productos desde el archivo JSON.
    readProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // Si hay un error al leer el archivo, regresamos un arreglo vacío.
            return [];
        }
    }

    // Método para guardar los productos en el archivo JSON.
    saveProductsToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar productos en el archivo:', error);
        }
    }

    // Método para agregar un nuevo producto.
    addProduct(productData) {
        const newProduct = {
            id: this.getNextProductId(),
            ...productData,
        };
        this.products.push(newProduct);
        // Después de agregar el producto, lo guardamos en el archivo.
        this.saveProductsToFile();
        return newProduct;
    }

    // Método para obtener todos los productos.
    getProducts() {
        return this.products;
    }

    // Método para obtener un producto por su ID.
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    // Método para actualizar un producto.
    updateProduct(updatedProduct) {
        const index = this.products.findIndex(product => product.id === updatedProduct.id);
        if (index !== -1) {
            this.products[index] = updatedProduct;
            // Después de actualizar el producto, lo guardamos en el archivo.
            this.saveProductsToFile();
            return updatedProduct;
        }
        return null;
    }

    // Método para eliminar un producto por su ID.
    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            // Después de eliminar el producto, actualizamos el archivo.
            this.saveProductsToFile();
            return true;
        }
        return false;
    }

    // Método para obtener el próximo ID disponible para un nuevo producto.
    getNextProductId() {
        const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
        return maxId + 1;
    }
}

// Ejemplo de uso
const productManager = new ProductManager('products.json');

productManager.addProduct({
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 10.99,
    thumbnail: 'imagen1.jpg',
    code: 'P123',
    stock: 20,
});

console.log(productManager.getProducts());

const productToUpdate = productManager.getProductById(1);
if (productToUpdate) {
    productToUpdate.title = 'Producto Actualizado';
    productManager.updateProduct(productToUpdate);
}

console.log(productManager.getProducts());

productManager.deleteProduct(1);

console.log(productManager.getProducts());
