import express from 'express';
import { Contenedor } from './class';

const app = express();
app.use(express.json());

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`)
 })
 server.on("error", error => console.log(`Error en servidor ${error}`))
 
 const listaProductos = new Contenedor("./productos.txt");

app.get('/', (_req, res) => {
    res.send({ mensaje: 'hola mundo' })
 })

 app.get('/productos', async (_req, res) => {
    const lista = await listaProductos.getAll();
    res.send({lista})
 })
 
 app.get('/productoRandom', async (_req, res) => {
    const lista = await listaProductos.getAll();
    if (lista) {
    const idRandom = Math.floor(Math.random()*JSON.parse(lista).length)
    const productoRandom = await listaProductos.getById(JSON.parse(lista)[idRandom].id)
    res.send({productoRandom})}
 })
