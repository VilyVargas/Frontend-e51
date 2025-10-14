
import React from "react";
import Titulo from "./components/Titulo.jsx";
import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; //Importar componente Encabezado.
import Encabezado from "./components/navegacion/Encabezado";

//Importar las vistas.
import Login from "./views/Login";
import Usuarios from "./views/Usuarios";
import Ventas from "./views/Ventas";
import Productos from "./views/Productos";
import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";
import Compras from "./views/Compras.jsx";
import Empleados from "./views/Empleados.jsx";
import Clientes from "./views/Clientes.jsx";
import Catalogo from "./views/Catalogo";

//Importar archivo de estilos.
import "./App.css";

const App = () =>{
  return (
    <Router>
      <Encabezado />
      <main className="margen-superior-main">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;