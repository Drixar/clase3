import * as fs from "fs";

export interface Product {
  title: string;
  price: string;
  thumbnail: string;
}

export interface ProductToAdd {
  id: number;
  title: string;
  price: string;
  thumbnail: string;
}

export class Contenedor {
  fileName: string;

  public constructor(fileName: string) {
    this.fileName = fileName;
  }

  public save = async (product: Product) => {
    try {
      //leer el archivo existe
      if (fs.existsSync(this.fileName)) {
        const contenido = await fs.promises.readFile(this.fileName, "utf8");
        // el archivo existe y tiene contenido
        if (contenido) {
          const productos: ProductToAdd[] = JSON.parse(contenido);

          if (productos.find((e) => e.title === product.title)) {
            return null;
          } else {
            const lastIdAdded = productos.reduce(
              (acc, item) => (item.id > acc ? (acc = item.id) : acc),
              0
            );
            const newProduct: ProductToAdd = {
              id: lastIdAdded + 1,
              ...product,
            };
            productos.push(newProduct);
            await fs.promises.writeFile(
              this.fileName,
              JSON.stringify(productos, null, 2)
            );
            return newProduct.id;
          }
        } else {
          // el archivo existe, pero no tiene contenido
          const newProduct = {
            id: 1,
            ...product,
          };
          //no existe el archivo
          await fs.promises.writeFile(
            this.fileName,
            JSON.stringify([newProduct], null, 2)
          );
          return newProduct.id;
        }
      } else {
        const newProduct = {
          id: 1,
          ...product,
        };
        //creamos el archivo
        await fs.promises.writeFile(
          this.fileName,
          JSON.stringify([newProduct], null, 2)
        );
        return newProduct.id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  getById = async (id: number) => {
    try {
      if (fs.existsSync(this.fileName)) {
        const contenido = await fs.promises.readFile(this.fileName, "utf8");
        if (contenido) {
          const productos: ProductToAdd[] = JSON.parse(contenido);
          const producto = productos.find((item) => item.id === id);
          if (producto) {
            return JSON.stringify(producto);
          } else {
            return "Elemento no encontrado";
          }
        } else {
          return "El archivo esta vacio";
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  getAll = async () => {
    try {
      const contenido = await fs.promises.readFile(this.fileName, "utf8");
      const productos = JSON.parse(contenido);
      return JSON.stringify(productos);
    } catch (error) {
      console.log(error);
    }
  };

  public deleteById = async (id: number) => {
    try {
      const contenido = await fs.promises.readFile(this.fileName, "utf8");
      const productos = JSON.parse(contenido);
      const newProducts = productos.filter((item: ProductToAdd) => item.id !== id);
      await fs.promises.writeFile(
        this.fileName,
        JSON.stringify(newProducts, null, 2)
      );
    } catch (error) {
      console.log(error);
    }
  };

  public deleteAll = async () => {
    try {
      await fs.promises.writeFile(this.fileName, JSON.stringify([]));
    } catch (error) {
      console.log(error);
    }
  };
}
