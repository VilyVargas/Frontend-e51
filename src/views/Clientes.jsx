import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TablaClientes from "../components/clientes/TablaClientes";
import ModalRegistroCliente from "../components/clientes/ModalRegistroClientes";
import ModalEdicionCliente from "../components/clientes/ModalEdicionClientes";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionClientes";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const [nuevoCliente, setNuevoCliente] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    celular: "",
    direccion: "",
    cedula: "",
  });

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({ ...prev, [name]: value }));
  };

  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/clientes");
      if (!respuesta.ok) throw new Error("Error al obtener clientes");
      const datos = await respuesta.json();
      setClientes(datos);
      setClientesFiltrados(datos);
    } catch (error) {
      console.error(error.message);
    }
  };

  const agregarCliente = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/registrarcliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoCliente),
      });
      if (!respuesta.ok) throw new Error("Error al registrar cliente");
      setMostrarModal(false);
      await obtenerClientes();
    } catch (error) {
      console.error(error.message);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = clientes.filter(
      (c) =>
        c.primer_nombre.toLowerCase().includes(texto) ||
        c.primer_apellido.toLowerCase().includes(texto) ||
        c.cedula.includes(texto)
    );
    setClientesFiltrados(filtrados);
  };

  const abrirModalEdicion = (cliente) => {
    setClienteSeleccionado({ ...cliente });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarcliente/${clienteSeleccionado.id_cliente}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clienteSeleccionado),
        }
      );
      if (!respuesta.ok) throw new Error("Error al actualizar cliente");
      setMostrarModalEdicion(false);
      await obtenerClientes();
    } catch (error) {
      console.error(error.message);
    }
  };

  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eliminarcliente/${clienteAEliminar.id_cliente}`,
        { method: "DELETE" }
      );
      if (!respuesta.ok) throw new Error("Error al eliminar cliente");
      setMostrarModalEliminar(false);
      await obtenerClientes();
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-4">
      <h4>Clientes</h4>
      <Row>
        <Col lg={5} md={6} sm={8} xs={12}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end">
          <Button className="color-boton-registro" onClick={() => setMostrarModal(true)}>
            + Nuevo Cliente
          </Button>
        </Col>
      </Row>

      <TablaClientes
        clientes={clientesPaginados}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        totalElementos={clientes.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

      <ModalRegistroCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejarCambioInput={manejarCambioInput}
        agregarCliente={agregarCliente}
      />

      <ModalEdicionCliente
        mostrar={mostrarModalEdicion}
        setMostrar={setMostrarModalEdicion}
        clienteSeleccionado={clienteSeleccionado}
        setClienteSeleccionado={setClienteSeleccionado}
        guardarEdicion={guardarEdicion}
      />

      <ModalEliminacionCliente
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        cliente={clienteAEliminar}
        confirmarEliminacion={confirmarEliminacion}
      />
    </Container>
  );
};

export default Clientes;