const fs = require("fs").promises;

class ProductManager {
  idAutomatico = 1;
  #productos = [];
  path = ``;

  constructor() {
    this.#productos = [];
    this.path = `./product.json`;
  }

  async createFile() {
    try {
      await fs.readFile(this.path, "utf-8");
      return "Leyendo archivo";
    } catch (error) {
      await fs.writeFile(this.path, "[]");
      return "Creando Archivo";
    }
  }

  async getProducts() {
    try {
      const productFile = await fs.readFile(this.path, "utf-8");
      return JSON.parse(productFile);
    } catch (e) {
      return "No hay archivo";
    }
  }

  async addProducts(product) {
    try {
      const productFile = await fs.readFile(this.path, "utf-8");
      let newProduct = JSON.parse(productFile);

      const valid = newProduct.find(
        (p) => p.id === product.id || p.code === product.code
      );

      if (valid) {
        throw new Error(
          "ID o Code repetido, no se ah podido crear un nuevo objeto"
        );
      }

      if (newProduct.length > 0) {
        const lastProduct = newProduct[newProduct.length - 1];

        this.idAutomatico = lastProduct.id + 1;
      }

      newProduct.push({
        ...product,
        id: this.idAutomatico++,
      });

      await fs.writeFile(this.path, JSON.stringify(newProduct, null, 2));
      return "Objeto creado";
    } catch (e) {
      return e;
    }
  }

  async getProductById(id) {
    try {
      const productFile = await fs.readFile(this.path, "utf-8");
      let idProduct = JSON.parse(productFile);

      const searchProduct = idProduct.find((p) => p.id === id);

      if (!searchProduct) {
        throw new Error("No se encontro el producto");
      }
      return searchProduct;
    } catch (e) {
      return e;
    }
  }

  async updateProduct(id, product) {
    try {
      const productFile = await fs.readFile(this.path, "utf-8");
      let products = JSON.parse(productFile);

      const idProduct = products.findIndex((p) => p.id === id);

      products.splice(idProduct, 1, { id, ...product });

      await fs.writeFile(this.path, JSON.stringify(products, null, 2));

      return `PRODUCTO MODIFICADO CORRECTAMENTE!!`;
    } catch (e) {
      return e;
    }
  }

  async deleteProduct(id) {
    try {
      const productFile = await fs.readFile(this.path, "utf-8");
      let products = JSON.parse(productFile);

      const idProduct = products.find((p) => p.id === id);

      if (!idProduct) {
        throw new Error("EL ID NO EXISTE.");
      }
      const deletedProducts = products.filter((p) => p.id !== id);

      await fs.writeFile(this.path, JSON.stringify(deletedProducts, null, 2));

      return `PRODUCTO ELIMINADO CORRECTAMENTE!!`;
    } catch (e) {
      return e;
    }
  }
}

const producto1 = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};
const producto2 = {
  title: "producto prueba2",
  description: "Este es un producto prueba",
  price: 20,
  thumbnail: "Sin imagen",
  code: "abc862",
  stock: 5,
};
const producto3 = {
  title: "producto prueba3",
  description: "Este es un producto prueba",
  price: 240,
  thumbnail: "Sin imagen",
  code: "abc555",
  stock: 10,
};

const producM = new ProductManager();

const main = async () => {
  console.log(await producM.createFile());
  console.log(await producM.addProducts(producto1));
  console.log(await producM.addProducts(producto2));
  console.log(await producM.addProducts(producto3));
  console.log(await producM.getProducts());
  console.log(await producM.getProductById());
  console.log(
    await producM.updateProduct(2, {
      ...producto1,
      code: "MODIFICADO",
    })
  );
  console.log("Lista Productos MODIFICADO: ", await producM.getProducts());
  console.log(await producM.deleteProduct(2));
  console.log("Lista Productos ELIMINADO: ", await producM.getProducts());
};

main();
