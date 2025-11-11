import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import TablaCompras from '../components/compras/TablaCompras';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalRegistroCompra from '../components/compras/ModalRegistroCompra';
import ModalEdicionCompra from '../components/compras/ModalEdicionCompra';
import ModalEliminacionCompra from '../components/compras/ModalEliminacionCompra';
import ModalDetallesCompra from '../components/detalles_compras/ModalDetallesCompra';

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);

  const [compraAEditar, setCompraAEditar] = useState(null);
  const [compraAEliminar, setCompraAEliminar] = useState(null);
  const [detallesCompra, setDetallesCompra] = useState([]);

  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;
  const hoy = new Date().toISOString().split('T')[0];

  // === ESTADO PARA REGISTRO ===
  const [nuevaCompra, setNuevaCompra] = useState({
    id_empleado: '',
    fecha_compra: hoy,
    total_compra: 0
  });

  // === ESTADO PARA EDICIÓN (SEPARADO) ===
  const [compraEnEdicion, setCompraEnEdicion] = useState(null);

  const [detallesNuevos, setDetallesNuevos] = useState([]);

  const comprasPaginadas = comprasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // === MÉTODOS PARA OBTENER NOMBRES ===
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

  const obtenerNombreProducto = async (idProducto) => {
    if (!idProducto) return '—';
    try {
      const resp = await fetch(`http://localhost:3000/api/producto/${idProducto}`);
      if (!resp.ok) return '—';
      const data = await resp.json();
      return data.nombre_producto || '—';
    } catch (error) {
      console.error("Error al cargar nombre del producto:", error);
      return '—';
    }
  };

  // === CARGAR COMPRAS CON NOMBRES ===
  const obtenerCompras = async () => {
    try {
      const resp = await fetch('http://localhost:3000/api/compras');
      if (!resp.ok) throw new Error('Error al cargar compras');
      const comprasRaw = await resp.json();

      const comprasConNombres = await Promise.all(
        comprasRaw.map(async (v) => ({
          ...v,
          nombre_empleado: await obtenerNombreEmpleado(v.id_empleado)
        }))
      );

      setCompras(comprasConNombres);
      setComprasFiltradas(comprasConNombres);
      setCargando(false);
    } catch (error) {
      console.error(error);
      alert("Error al cargar compras.");
      setCargando(false);
    }
  };

  // === CARGAR DETALLES CON NOMBRE DE PRODUCTO ===
  const obtenerDetallesCompras = async (id_compra) => {
    try {
      const resp = await fetch('http://localhost:3000/api/detallescompras');
      if (!resp.ok) throw new Error('Error al cargar detalles');
      const todos = await resp.json();
      const filtrados = todos.filter(d => d.id_compra === parseInt(id_compra));

      const detalles = await Promise.all(
        filtrados.map(async (d) => ({
          ...d,
          nombre_producto: await obtenerNombreProducto(d.id_producto)
        }))
      );

      setDetallesCompra(detalles);
      setMostrarModalDetalles(true);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los detalles.");
    }
  };

  // === CARGAR CATÁLOGOS ===
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

  // === BÚSQUEDA ===
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = compras.filter(v =>
      v.id_compra.toString().includes(texto) ||
      (v.nombre_empleado && v.nombre_empleado.toLowerCase().includes(texto))
    );
    setComprasFiltradas(filtrados);
    setPaginaActual(1);
  };

  // === REGISTRO ===
  const agregarCompra = async () => {
    if (!nuevaCompra.id_empleado || detallesNuevos.length === 0) {
      alert("Completa empleado y al menos un detalle.");
      return;
    }

    const total = detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);

    try {
      const compraResp = await fetch('http://localhost:3000/api/registrarcompra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevaCompra, total_compra: total })
      });

      if (!compraResp.ok) throw new Error('Error al crear compra');
      const { id_compra } = await compraResp.json();

      for (const d of detallesNuevos) {
        await fetch('http://localhost:3000/api/registrardetallecompra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...d, id_compra })
        });
      }

      await obtenerCompras();
      cerrarModalRegistro();
    } catch (error) {
      console.error(error);
      alert("Error al registrar compra.");
    }
  };

  // === EDICIÓN ===
  const abrirModalEdicion = async (compra) => {
    setCompraAEditar(compra);

    setCompraEnEdicion({
      id_empleado: compra.id_empleado,
      fecha_compra: new Date(compra.fecha_compra).toISOString().split("T")[0]
    });

    const resp = await fetch('http://localhost:3000/api/detallescompras');
    const todos = await resp.json();
    const detallesRaw = todos.filter(d => d.id_compra === compra.id_compra);

    const detalles = await Promise.all(
      detallesRaw.map(async (d) => ({
        id_producto: d.id_producto,
        nombre_producto: await obtenerNombreProducto(d.id_producto),
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario
      }))
    );

    setDetallesNuevos(detalles);
    setMostrarModalEdicion(true);
  };

  const actualizarCompra = async () => {
    const total = detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);
    try {
      await fetch(`http://localhost:3000/api/actualizarCompra/${compraAEditar.id_compra}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...compraEnEdicion, total_compra: total })
      });

      const resp = await fetch('http://localhost:3000/api/detallescompras');
      const todos = await resp.json();
      const actuales = todos.filter(d => d.id_compra === compraAEditar.id_compra);
      for (const d of actuales) {
        await fetch(`http://localhost:3000/api/eliminardetallecompra/${d.id_detalle_compra}`, { method: 'DELETE' });
      }

      for (const d of detallesNuevos) {
        await fetch('http://localhost:3000/api/registrardetallecompra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...d, id_compra: compraAEditar.id_compra })
        });
      }

      await obtenerCompras();
      cerrarModalEdicion();
    } catch (error) {
      alert("Error al actualizar.");
    }
  };

  // === ELIMINACIÓN ===
  const abrirModalEliminacion = (compra) => {
    setCompraAEliminar(compra);
    setMostrarModalEliminar(true);
  };

  const eliminarCompra = async () => {
    try {
      await fetch(`http://localhost:3000/api/eliminarcompra/${compraAEliminar.id_compra}`, { method: 'DELETE' });
      await obtenerCompras();
      setMostrarModalEliminar(false);
    } catch (error) {
      alert("No se pudo eliminar.");
    }
  };

  // === LIMPIEZA DE MODALES ===
  const cerrarModalRegistro = () => {
    setMostrarModalRegistro(false);
    setNuevaCompra({ id_empleado: '', fecha_compra: hoy, total_compra: 0 });
    setDetallesNuevos([]);
  };

  const cerrarModalEdicion = () => {
    setMostrarModalEdicion(false);
    setCompraAEditar(null);
    setCompraEnEdicion(null);  // Limpia estado de edición
    setDetallesNuevos([]);
  };

  useEffect(() => {
    obtenerCompras();
    obtenerEmpleados();
    obtenerProductos();
  }, []);

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
          <Button className="color-boton-registro" onClick={() => setMostrarModalRegistro(true)}>
            + Nueva Compras
          </Button>
        </Col>
      </Row>

      <TablaCompras
        compras={comprasPaginadas}
        cargando={cargando}
        obtenerDetalles={obtenerDetallesCompras}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        totalElementos={comprasFiltradas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
      />

      <ModalRegistroCompra
        mostrar={mostrarModalRegistro}
        setMostrar={cerrarModalRegistro}
        nuevaCompra={nuevaCompra}
        setNuevaCompra={setNuevaCompra}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        empleados={empleados}
        productos={productos}
        agregarCompra={agregarCompra}
        hoy={hoy}
      />

      <ModalEdicionCompra
        mostrar={mostrarModalEdicion}
        setMostrar={cerrarModalEdicion}
        compra={compraAEditar}
        compraEnEdicion={compraEnEdicion}
        setCompraEnEdicion={setCompraEnEdicion}
        detalles={detallesNuevos}
        setDetalles={setDetallesNuevos}
        empleados={empleados}
        productos={productos}
        actualizarCompra={actualizarCompra}
      />

      <ModalEliminacionCompra
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        compra={compraAEliminar}
        confirmarEliminacion={eliminarCompra}
      />

      <ModalDetallesCompra
        mostrarModal={mostrarModalDetalles}
        setMostrarModal={() => setMostrarModalDetalles(false)}
        detalles={detallesCompra}
      />
    </Container>
  );
};

export default Compras;
