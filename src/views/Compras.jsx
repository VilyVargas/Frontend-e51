import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaCompras from "../components/compras/TablaCompras";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroCompra from "../components/compras/ModalRegistroCompra";
import ModalEdicionCompra from "../components/compras/ModalEdicionCompra";
import ModalEliminacionCompra from "../components/compras/ModalEliminacionCompra";
import ModalDetallesCompra from "../components/detalles_compras/ModalDetallesCompra";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [compraAEliminar, setCompraAEliminar] = useState(null);
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const [nuevaCompra, setNuevaCompra] = useState({
    id_empleado: "",
    fecha_compra: "",
    total_compra: "",
  });

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCompra((prev) => ({ ...prev, [name]: value }));
  };

  const obtenerCompras = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/api/compras");
      if (!respuesta.ok) throw new Error("Error al obtener compras");
      const datos = await respuesta.json();
      setCompras(datos);
      setComprasFiltradas(datos);
    } catch (error) {
      console.error(error.message);
    }
  };

  const agregarCompra = async () => {
    if (!nuevaCompra.id_empleado || !nuevaCompra.fecha_compra) return;
    try {
      const respuesta = await fetch("http://localhost:3000/api/registrarcompra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCompra),
      });
      if (!respuesta.ok) throw new Error("Error al guardar compra");
      setNuevaCompra({
        id_empleado: "",
        fecha_compra: "",
        total_compra: "",
      });
      setMostrarModal(false);
      await obtenerCompras();
    } catch (error) {
      console.error("Error al agregar compra:", error);
      alert("No se pudo guardar la compra.");
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtradas = compras.filter(
      (compra) =>
        String(compra.id_compra).includes(texto) ||
        String(compra.id_empleado).includes(texto)
    );
    setComprasFiltradas(filtradas);
  };

  const abrirModalEdicion = (compra) => {
    setCompraSeleccionada({ ...compra });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarcompra/${compraSeleccionada.id_compra}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(compraSeleccionada),
        }
      );
      if (!respuesta.ok) throw new Error("Error al actualizar compra");
      setMostrarModalEdicion(false);
      await obtenerCompras();
    } catch (error) {
      console.error("Error al editar compra:", error);
      alert("No se pudo actualizar la compra.");
    }
  };

  const abrirModalEliminacion = (compra) => {
    setCompraAEliminar(compra);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eliminarcompra/${compraAEliminar.id_compra}`,
        { method: "DELETE" }
      );
      if (!respuesta.ok) throw new Error("Error al eliminar compra");
      setMostrarModalEliminar(false);
      await obtenerCompras();
    } catch (error) {
      console.error("Error al eliminar compra:", error);
      alert("No se pudo eliminar la compra.");
    }
  };

  const abrirModalDetalles = (compra) => {
    setCompraSeleccionada(compra);
    setMostrarModalDetalles(true);
  };

  useEffect(() => {
    obtenerCompras();
  }, []);

  const comprasPaginadas = comprasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-4">
      <h4>Compras</h4>
      <Row>
        <Col lg={5} md={6} sm={8} xs={12}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        <Col className="text-end">
          <Button className="color-boton-registro" onClick={() => setMostrarModal(true)}>
            + Nueva Compra
          </Button>
        </Col>
      </Row>

      <TablaCompras
        compras={comprasPaginadas}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalDetalles={abrirModalDetalles}
        totalElementos={compras.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

      <ModalRegistroCompra
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCompra={nuevaCompra}
        manejarCambioInput={manejarCambioInput}
        agregarCompra={agregarCompra}
      />

      <ModalEdicionCompra
        mostrar={mostrarModalEdicion}
        setMostrar={setMostrarModalEdicion}
        compraSeleccionada={compraSeleccionada}
        setCompraSeleccionada={setCompraSeleccionada}
        guardarEdicion={guardarEdicion}
      />

      <ModalEliminacionCompra
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        compra={compraAEliminar}
        confirmarEliminacion={confirmarEliminacion}
      />

      <ModalDetallesCompra
        mostrar={mostrarModalDetalles}
        setMostrar={setMostrarModalDetalles}
        compra={compraSeleccionada}
      />
    </Container>
  );
};

export default Compras;