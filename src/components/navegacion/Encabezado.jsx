
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";

const Encabezado = () => {
const [mostrarMenu, setMostrarMenu] = useState(false);
const navigate = useNavigate();

// Alternar visibilidad del menú
const manejarToggle = () => setMostrarMenu(!mostrarMenu);

// Navegar y cerrar menú
const manejarNavegacion = (ruta) => {
navigate(ruta);
setMostrarMenu(false);
};



return (
  <Navbar expand="md" fixed="top" className="bg-primary">
    <Container>
      <Navbar.Brand
        onClick={() => manejarNavegacion("/")}
        className="text-white fw-bold"
        style={{ cursor: "pointer" }}
      >
        Ferretería
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="menu-offcanvas"
        onClick={manejarToggle}
        className="bg-light"
      />
      <Navbar.Offcanvas
        id="menu-offcanvas"
        placement="end"
        show={mostrarMenu}
        onHide={() => setMostrarMenu(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu principal</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-grow-1 pe-3">
            <Nav.Link onClick={() => manejarNavegacion("/")}>Inicio</Nav.Link>
            <Nav.Link onClick={() => manejarNavegacion("/categorias")}>Categorías</Nav.Link>
            <Nav.Link onClick={() => manejarNavegacion("/usuarios")}>Usuarios</Nav.Link>
            <Nav.Link onClick={() => manejarNavegacion("/empleados")}>Empleados</Nav.Link>
            <Nav.Link onClick={() => manejarNavegacion("/clientes")}>Clientes</Nav.Link>
            <Nav.Link onClick={() => manejarNavegacion("/compras")}>Compras</Nav.Link>
            <Nav.Link onClick={() => manejarNavegacion("/ventas")}>Ventas</Nav.Link>
            <Nav.Link onClick={() => manejarNavegacion("/productos")}>Productos</Nav.Link>
            <Nav.Link onClick={() => manejarNavegacion("/catalogo")}>Catalogo</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Container>
  </Navbar>
);
};

export default Encabezado;

