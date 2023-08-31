class ProductManager {
    constructor() {
        this.products = [];
        this.nextProductId = 1;
    }

    addProduct(productData) {
        const { title, description, price, thumbnail, code, stock } = productData;

        if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
            console.log("Todos los campos son obligatorios. Por favor revisar la lista de items.");
            return;
        }

        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            console.log("Ya existe un producto con el mismo código. Por favor revisar la lista de items.");
            return;
        }

        const newProduct = {
            id: this.nextProductId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(newProduct);
        this.nextProductId++;
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.log("Producto no encontrado.");
        }
        return product;
    }
}

// Ejemplo de uso
const productManager = new ProductManager();

productManager.addProduct({
    title: "Producto 1",
    description: "Descripción del producto 1",
    price: 10.99,
    thumbnail: "imagen1.jpg",
    code: "P123",
    stock: 20
});

productManager.addProduct({
    title: "Producto 2",
    description: "Descripción del producto 2",
    price: 25.99,
    thumbnail: "imagen2.jpg",
    code: "P124",
    stock: 15
});


console.log(productManager.getProducts());

const productById = productManager.getProductById(1); // Reemplazar aquí.
if (productById) {
    console.log("Producto encontrado:", productById);
}

// Reemplazar el 1 por el producto a encontrar por id. Siendo id 1 el producto 1, id 2 el producto 2 y así sucesivamente.