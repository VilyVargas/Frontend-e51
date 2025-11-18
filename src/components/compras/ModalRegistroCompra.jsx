import { useState } from "react";
import { Modal, Form, Button, Row, Col, FormControl, Table } from "react-bootstrap";
import AsyncSelect from 'react-select/async';

const ModalRegistroCompra = ({
  mostrarModal,
  setMostrarModal,
  nuevaCompra,
  manejarCambioInput,
  agregarCompra,
  empleados = [],
  productos = [],
  detalles = [],
  setDetalles = () => {},
  hoy
}) => {
  const [empleadoSel, setEmpleadoSel] = useState(null);
  const [productoSel, setProductoSel] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_producto: '', cantidad: '' });

  const total = detalles.reduce((s, d) => s + (d.cantidad * d.precio_unitario), 0);

  const cargarOpciones = (lista, campo) => (input, callback) => {
    const filtrados = lista.filter(item =>
      (item[campo] || `${item.primer_nombre} ${item.primer_apellido}`).toString().toLowerCase().includes(input.toLowerCase())
    );
    callback(filtrados.map(item => ({
      value: item.id_empleado || item.id_producto,
      label: item[campo] || `${item.primer_nombre} ${item.primer_apellido}`,
      precio: item.precio_unitario,
      stock: item.stock
    })));
  };

  const manejarEmpleado = (sel) => {
    setEmpleadoSel(sel);
    manejarCambioInput({ target: { name: 'id_empleado', value: sel ? sel.value : '' } });
  }

  const manejarProducto = (sel) => {
    setProductoSel(sel);
    setNuevoDetalle(prev => ({ ...prev, id_producto: sel ? sel.value : '', precio_unitario: sel ? sel.precio : '' }));
  }

  const agregarDetalle = () => {
    if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0) {
      alert('Selecciona producto y cantidad válida.');
      return;
    }

    const prod = productos.find(p => p.id_producto === parseInt(nuevoDetalle.id_producto));
    if (prod && nuevoDetalle.cantidad > prod.stock) {
      alert(`Stock insuficiente: ${prod.stock}`);
      return;
    }

    setDetalles(prev => [...prev, {
      id_producto: parseInt(nuevoDetalle.id_producto),
      nombre_producto: prod ? prod.nombre_producto : '',
      cantidad: parseInt(nuevoDetalle.cantidad),
      precio_unitario: parseFloat(nuevoDetalle.precio_unitario || prod?.precio_unitario || 0)
    }]);

    setNuevoDetalle({ id_producto: '', cantidad: '' });
    setProductoSel(null);
  }
  return (
    <Modal backdrop="static" show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nueva Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="id_empleado">
                <Form.Label>ID Empleado *</Form.Label>
                <AsyncSelect
                  cacheOptions defaultOptions
                  loadOptions={cargarOpciones(empleados, 'primer_nombre')}
                  onChange={manejarEmpleado}
                  value={empleadoSel}
                  placeholder="Buscar empleado..."
                  isClearable
                />
              </Form.Group>
            </Col>
            <Col md={12} className="mt-3">
              <h6>Agregar Producto</h6>
              <Row>
                <Col md={6}>
                  <AsyncSelect
                    cacheOptions defaultOptions
                    loadOptions={cargarOpciones(productos, 'nombre_producto')}
                    onChange={manejarProducto}
                    value={productoSel}
                    placeholder="Buscar producto..."
                    isClearable
                  />
                </Col>
                <Col md={3}>
                  <FormControl
                    type="number"
                    placeholder="Cantidad"
                    value={nuevoDetalle.cantidad}
                    onChange={e => setNuevoDetalle(prev => ({ ...prev, cantidad: e.target.value }))}
                    min="1"
                  />
                </Col>
                <Col md={3}>
                  <Button variant="success" onClick={agregarDetalle} style={{ width: '100%' }}>
                    Agregar
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="fecha_compra">
                <Form.Label>Fecha de Compra *</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_compra"
                  value={nuevaCompra.fecha_compra}
                  onChange={manejarCambioInput}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

            {detalles.length > 0 && (
              <Table striped className="mt-3">
                <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th><th></th></tr></thead>
                <tbody>
                  {detalles.map((d, i) => (
                    <tr key={i}>
                      <td>{d.nombre_producto}</td>
                      <td>{d.cantidad}</td>
                      <td>C$ {d.precio_unitario.toFixed(2)}</td>
                      <td>C$ {(d.cantidad * d.precio_unitario).toFixed(2)}</td>
                      <td>
                        <Button size="sm" variant="danger" onClick={() => setDetalles(prev => prev.filter((_, idx) => idx !== i))}>X</Button>
                      </td>
                    </tr>
                  ))}
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                      <td colSpan={2}><strong>C$ {total.toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </tbody>
              </Table>
            )}

            <Form.Group className="mb-3" controlId="total_compra">
            <Form.Label>Total (C$)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="total_compra"
              value={nuevaCompra.total_compra}
              onChange={manejarCambioInput}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarCompra}
          disabled={!nuevaCompra.id_empleado || !nuevaCompra.fecha_compra}
        >
          Guardar Compra
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCompra;