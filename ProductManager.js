const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.readProductsFromFile();
  }

  readProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      
      return [];
    }
  }

  saveProductsToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  getProducts() {
    return this.products;
  }

  addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      return "Todos los campos son obligatorios.";
    }

    const searchCode = this.products.find(prod => prod.code === product.code);

    if (searchCode) {
      return "Hay un producto con el mismo código repetido.";
    }

    if (this.products.length === 0) {
      product.id = 1;
      this.products.push(product);
    } else {
      product.id = this.products[this.products.length - 1].id + 1;
      this.products.push(product);
    }

    this.saveProductsToFile();
    return "Producto agregado";
  }

  getProductById(id) {
    const searchProduct = this.products.find(prod => prod.id === id);
    return searchProduct ? searchProduct : "Producto no encontrado";
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex(prod => prod.id === id);

    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.saveProductsToFile();
      return "Producto actualizado";
    }

    return "Producto no encontrado";
  }

  deleteProduct(id) {
    const index = this.products.findIndex(prod => prod.id === id);

    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProductsToFile();
      return "Producto eliminado";
    }

    return "Producto no encontrado";
  }
}

const productManager = new ProductManager('products.json');


console.log(productManager.addProduct({ title: "remera", description: "remera con estampa blanca", price: 4000, thumbnail: "remerafoto", stock: 30, code: "d345" }));
console.log(productManager.addProduct({ title: "pantalon", description: "pantalon negro con brillos", price: 12000, thumbnail: "pantalonfoto", stock: 40, code: "d343" }));
console.log(productManager.addProduct({ title: "camisa", description: "camisa a cuadros", price: 5000, thumbnail: "camisafoto", stock: 60, code: "f347" }));

console.log(productManager.getProductById(2));
console.log(productManager.getProducts());

console.log(productManager.updateProduct(2, { price: 15000 }));
console.log(productManager.getProducts());

console.log(productManager.deleteProduct(1));
console.log(productManager.getProducts());

  