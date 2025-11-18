import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionUsuario= ({
  mostrar,
  setMostrar,
  usuarioEditado,
  setUsuarioEditado,
  guardarEdicion
}) => {

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setUsuarioEditado((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="usuario">
            <Form.Label>Nombre del Usuario</Form.Label>
            <Form.Control
              type="text"
              name="usuario"
              value={usuarioEditado?.usuario}
              onChange={manejarCambio}
              placeholder="Ej: tito calderon"
              maxLength={20}
              required
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="contraseña">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="contraseña"
              value={usuarioEditado?.contraseña}
              onChange={manejarCambio}
              placeholder="Ej: tito calderon"
              maxLength={30}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={!usuarioEditado?.usuario.trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalEdicionUsuario;