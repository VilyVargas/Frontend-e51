import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejarCambioInput,
  agregarCliente,
}) => {
  return (
    <Modal backdrop="static" show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nuevo Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Primer Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="primer_nombre"
                  value={nuevoCliente.primer_nombre}
                  onChange={manejarCambioInput}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Segundo Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="segundo_nombre"
                  value={nuevoCliente.segundo_nombre}
                  onChange={manejarCambioInput}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Primer Apellido *</Form.Label>
                <Form.Control
                  type="text"
                  name="primer_apellido"
                  value={nuevoCliente.primer_apellido}
                  onChange={manejarCambioInput}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Segundo Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="segundo_apellido"
                  value={nuevoCliente.segundo_apellido}
                  onChange={manejarCambioInput}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Celular *</Form.Label>
                <Form.Control
                  type="text"
                  name="celular"
                  value={nuevoCliente.celular}
                  onChange={manejarCambioInput}
                  maxLength="8"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cédula *</Form.Label>
                <Form.Control
                  type="text"
                  name="cedula"
                  value={nuevoCliente.cedula}
                  onChange={manejarCambioInput}
                  maxLength="14"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="direccion"
              value={nuevoCliente.direccion}
              onChange={manejarCambioInput}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarCliente}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCliente;