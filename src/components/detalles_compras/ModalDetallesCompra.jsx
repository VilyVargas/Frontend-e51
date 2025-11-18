import { useState, useEffect } from "react";
import { Modal, Table, Button } from "react-bootstrap";

const ModalDetallesCompra = ({ mostrar, setMostrar, compra }) => {
  const [detalles, setDetalles] = useState([]);

  const obtenerDetalles = async () => {
    if (!compra) return;
    try {
      const respuesta = await fetch("http://localhost:3000/api/detallescompras");
      if (!respuesta.ok) throw new Error("Error al obtener detalles");
      const datos = await respuesta.json();
      const filtrados = datos.filter((d) => d.id_compra === compra.id_compra);
      setDetalles(filtrados);
    } catch (error) {
      console.error("Error al obtener detalles:", error);
    }
  };

  useEffect(() => {
    if (mostrar) obtenerDetalles();
  }, [mostrar]);

  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Compra #{compra?.id_compra}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {detalles.length > 0 ? (
          <Table bordered hover className="align-middle">
            <thead>
              <tr>
                <th>ID Detalle</th>
                <th>ID Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario (C$)</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((d) => (
                <tr key={d.id_detalle_compra}>
                  <td>{d.id_detalle_compra}</td>
                  <td>{d.id_producto}</td>
                  <td>{d.cantidad}</td>
                  <td>{Number(d.precio_unitario).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">
            No hay detalles registrados para esta compra.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesCompra;
