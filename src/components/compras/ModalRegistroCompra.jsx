import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroCompra = ({
  mostrarModal,
  setMostrarModal,
  nuevaCompra,
  manejarCambioInput,
  agregarCompra,
}) => {
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
                <Form.Control
                  type="number"
                  name="id_empleado"
                  value={nuevaCompra.id_empleado}
                  onChange={manejarCambioInput}
                  required
                />
              </Form.Group>
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