import React, { useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaCompras = ({
  compras,
  abrirModalEdicion,
  abrirModalEliminacion,
  abrirModalDetalles,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual
}) => {
  const [orden, setOrden] = useState({ campo: "id_compra", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion:
        prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const comprasOrdenadas = [...compras].sort((a, b) => {
    const valorA = a[orden.campo] ?? "";
    const valorB = b[orden.campo] ?? "";
    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }
    const comparacion = String(valorA).localeCompare(String(valorB));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (!compras.length) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
        <p>Cargando compras...</p>
      </div>
    );
  }

  return (
    <>
      <Table striped bordered hover className="mt-3 align-middle">
        <thead>
          <tr>
            <BotonOrden campo="id_compra" orden={orden} manejarOrden={manejarOrden}>ID</BotonOrden>
            <BotonOrden campo="id_empleado" orden={orden} manejarOrden={manejarOrden}>Empleado</BotonOrden>
            <BotonOrden campo="fecha_compra" orden={orden} manejarOrden={manejarOrden}>Fecha</BotonOrden>
            <BotonOrden campo="total_compra" orden={orden} manejarOrden={manejarOrden}>Total (C$)</BotonOrden>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comprasOrdenadas.map((compra) => (
            <tr key={compra.id_compra}>
              <td>{compra.id_compra}</td>
              <td>{compra.nombre_empleado || compra.id_empleado}</td>
              <td>{new Date(compra.fecha_compra).toLocaleDateString()}</td>
              <td>{Number(compra.total_compra).toFixed(2)}</td>
              <td>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalDetalles(compra)}
                >
                  <i className="bi bi-list"></i>
                </Button>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(compra)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(compra)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

export default TablaCompras;