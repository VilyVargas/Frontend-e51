import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionCompra = ({
  mostrar,
  setMostrar,
  compraSeleccionada,
  setCompraSeleccionada,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setCompraSeleccionada((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="id_empleado">
                <Form.Label>ID Empleado</Form.Label>
                <Form.Control
                  type="number"
                  name="id_empleado"
                  value={compraSeleccionada?.id_empleado || ""}
                  onChange={manejarCambio}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="fecha_compra">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_compra"
                  value={compraSeleccionada?.fecha_compra || ""}
                  onChange={manejarCambio}
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
              value={compraSeleccionada?.total_compra || ""}
              onChange={manejarCambio}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={guardarEdicion}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCompra;
