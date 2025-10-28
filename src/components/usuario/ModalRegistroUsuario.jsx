import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCategoria = ({
  mostrarModal,
  setMostrarModal,
  nuevoUsuario,
  manejarCambioInput,
  agregarUsuario,
}) => {
  return (
    <Modal backdrop="static" show={mostrarModal} onHide={() => setMostrarModal(false)} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="usuario">
            <Form.Label>Nombre del usuario</Form.Label>
            <Form.Control
              type="text"
              name="usuario"
              value={nuevoUsuario.usuario}
              onChange={manejarCambioInput}
              placeholder="Ej: eli123"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="contraseña">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="contraseña"
              value={nuevoUsuario.contraseña}
              onChange={manejarCambioInput}
              placeholder="ingrese la contraseña"
              maxLength={100}
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
          onClick={agregarUsuario}
          disabled={!nuevoUsuario.usuario.trim()}
        >
          Guardar usuario
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCategoria;
