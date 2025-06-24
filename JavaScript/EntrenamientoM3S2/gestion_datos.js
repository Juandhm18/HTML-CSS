
const productos = [
    { id: 1, nombre: "Laptop", precio: 1200 },
    { id: 2, nombre: "Mouse", precio: 25 },
    { id: 3, nombre: "Teclado", precio: 45 },
    { id: 4, nombre: "Monitor", precio: 300 }
];

const setProductos = new Set(Object.values(productos).map(producto => producto.nombre));
console.log("set de productos unicos: ", setProductos);

const mapProductos = new Map([
    ["Electronica", "Laptop"],
    ["Accesorios", ["Mouse", "Teclado"]]
]);
console.log("Map de productos unicos: ", mapProductos);

for (const id in productos) {
    console.log(`Producto ID: ${id}, detalles:`, productos[id]);
}

for (const producto of setProductos){
    console.log("Producto unico:", producto);
}

mapProductos.forEach((producto, categoria) => {
    console.log(`Categoria: ${categoria}, Producto: ${producto}`);
})

console.log("Pruebas completas de gestion de datos:");
console.log("Lista de productos (Objeto):", productos);
console.log("Lista de productos unicos(Set):", setProductos);
console.log("CAtegorias y productos(Map):", mapProductos);