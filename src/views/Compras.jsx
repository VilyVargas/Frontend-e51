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
      // agregar nombre de empleado para mostrar en la tabla
      const datosConNombres = await Promise.all(
        datos.map(async (c) => ({
          ...c,
          nombre_empleado: await obtenerNombreEmpleado(c.id_empleado),
        }))
      );

      setCompras(datosConNombres);
      setComprasFiltradas(datosConNombres);
    } catch (error) {
      console.error(error.message);
    }
  };

  const agregarCompra = async () => {
    if (!nuevaCompra.id_empleado || !nuevaCompra.fecha_compra) return;
    if (!detallesNuevos.length) {
      alert("Agrega al menos un producto a la compra.");
      return;
    }
    try {
      const total = detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);
      const respuesta = await fetch("http://localhost:3000/api/registrarcompra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nuevaCompra, total_compra: total }),
      });
      if (!respuesta.ok) throw new Error("Error al guardar compra");
      const { id_compra } = await respuesta.json();

      // registrar detalles de compra (similar a ventas)
      for (const d of detallesNuevos) {
        await fetch('http://localhost:3000/api/registrardetallecompra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...d, id_compra })
        });
      }
      setNuevaCompra({
        id_empleado: "",
        fecha_compra: "",
        total_compra: "",
      });
      setMostrarModal(false);
      setDetallesNuevos([]);
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
    // cargar detalles de la compra y mapear nombre de producto
    (async () => {
      try {
        const resp = await fetch('http://localhost:3000/api/detallescompras');
        if (!resp.ok) throw new Error('Error al cargar detalles');
        const todos = await resp.json();
        const detallesRaw = todos.filter(d => d.id_compra === compra.id_compra);

        const detallesConNombres = await Promise.all(
          detallesRaw.map(async (d) => {
            try {
              const r = await fetch(`http://localhost:3000/api/producto/${d.id_producto}`);
              const pd = r.ok ? await r.json() : null;
              return {
                id_producto: d.id_producto,
                id_detalle_compra: d.id_detalle_compra,
                nombre_producto: pd ? pd.nombre_producto : '—',
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario
              };
            } catch (error) {
              return { ...d, nombre_producto: '—' };
            }
          })
        );

        setDetallesNuevos(detallesConNombres);
      } catch (error) {
        console.error(error);
      }
    })();

    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    try {
      // recalcular total desde detalles
      const total = detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);

      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarcompra/${compraSeleccionada.id_compra}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...compraSeleccionada, total_compra: total }),
        }
      );
      if (!respuesta.ok) throw new Error("Error al actualizar compra");

      // eliminar detalles antiguos
      const resp = await fetch('http://localhost:3000/api/detallescompras');
      const todos = await resp.json();
      const actuales = todos.filter(d => d.id_compra === compraSeleccionada.id_compra);
      for (const d of actuales) {
        await fetch(`http://localhost:3000/api/eliminardetallecompra/${d.id_detalle_compra}`, { method: 'DELETE' });
      }

      // registrar nuevos detalles
      for (const d of detallesNuevos) {
        await fetch('http://localhost:3000/api/registrardetallecompra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_compra: compraSeleccionada.id_compra, id_producto: d.id_producto, cantidad: d.cantidad, precio_unitario: d.precio_unitario })
        });
      }

      setMostrarModalEdicion(false);
      setDetallesNuevos([]);
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

  // === CARGAR CATÁLOGOS ===
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  const obtenerEmpleados = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/empleados');
      if (!resp.ok) throw new Error('Error al cargar empleados');
      const datos = await resp.json();
      setEmpleados(datos);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerProductos = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/productos');
      if (!resp.ok) throw new Error('Error al cargar productos');
      const datos = await resp.json();
      setProductos(datos);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerNombreEmpleado = async (idEmpleado) => {
    if (!idEmpleado) return '—';
    try {
      const resp = await fetch(`http://localhost:3000/api/empleado/${idEmpleado}`);
      if (!resp.ok) return '—';
      const data = await resp.json();
      return `${data.primer_nombre} ${data.primer_apellido}`;
    } catch (error) {
      console.error("Error al cargar nombre del empleado:", error);
      return '—';
    }
  };

  useEffect(() => {
    obtenerCompras();
    obtenerEmpleados();
    obtenerProductos();
  }, []);

  // === ESTADO PARA DETALLES ===
  const [detallesNuevos, setDetallesNuevos] = useState([]);
  const hoy = new Date().toISOString().split('T')[0];

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
        empleados={empleados}
        productos={productos}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        hoy={hoy}
      />

      <ModalEdicionCompra
        mostrar={mostrarModalEdicion}
        setMostrar={setMostrarModalEdicion}
        compraSeleccionada={compraSeleccionada}
        setCompraSeleccionada={setCompraSeleccionada}
        guardarEdicion={guardarEdicion}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        empleados={empleados}
        productos={productos}
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