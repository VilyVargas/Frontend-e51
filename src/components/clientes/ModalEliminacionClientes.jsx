import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCliente = ({ mostrar, setMostrar, cliente, confirmarEliminacion }) => {
  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro que deseas eliminar al cliente{" "}
          <strong>
            {cliente?.primer_nombre} {cliente?.primer_apellido}
          </strong>{" "}
          (ID: {cliente?.id_cliente})?
        </p>
        <p className="text-muted small">Esta acción no se puede deshacer.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={confirmarEliminacion}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCliente;