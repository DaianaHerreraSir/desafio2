const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products=[];
    this.readProductsFromFile();
  }

  async readProductsFromFile() {
    try {
      const data = await fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      
      this.products= [];
    }
  }

  async saveProductsToFile() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  getProducts() {
    return this.products;
  }

  async addProduct(product) {
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

  await this.saveProductsToFile();
    return "Producto agregado";
  }

  getProductById(id) {
    const searchProduct = this.products.find(prod => prod.id === id);
    return searchProduct ? searchProduct : "Producto no encontrado";
  }

 async updateProduct(id, updatedProduct) {
    const index = this.products.findIndex(prod => prod.id === id);

    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      await this.saveProductsToFile();
      return "Producto actualizado";
    }

    return "Producto no encontrado";
  }

async deleteProduct(id) {
    const index = this.products.findIndex(prod => prod.id === id);

    if (index !== -1) {
      this.products.splice(index, 1);
    await this.saveProductsToFile();
      return "Producto eliminado";
    }

    return "Producto no encontrado";
  }
}

const productManager = new ProductManager('products.json');

(async()=>{
  console.log( await productManager.addProduct({ title: "remera", description: "remera con estampa blanca", price: 4000, thumbnail: "remerafoto", stock: 30, code: "d345" }));
console.log(await productManager.addProduct({ title: "pantalon", description: "pantalon negro con brillos", price: 12000, thumbnail: "pantalonfoto", stock: 40, code: "d343" }));
console.log(await productManager.addProduct({ title: "camisa", description: "camisa a cuadros", price: 5000, thumbnail: "camisafoto", stock: 60, code: "f347" }));

console.log(productManager.getProductById(2));
console.log(productManager.getProducts());

console.log(await productManager.updateProduct(2, { price: 15000 }));
console.log(productManager.getProducts());

console.log(await productManager.deleteProduct(1));
console.log(productManager.getProducts())
})()
;

  