import React, { useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaClientes = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual
}) => {
  const [orden, setOrden] = useState({ campo: "id_cliente", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion:
        prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const clientesOrdenados = [...clientes].sort((a, b) => {
    const valorA = a[orden.campo] ?? "";
    const valorB = b[orden.campo] ?? "";
    const comparacion = String(valorA).localeCompare(String(valorB));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (!clientes.length) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
        <p>Cargando clientes...</p>
      </div>
    );
  }

  return (
    <>
      <Table striped bordered hover className="mt-3 align-middle">
        <thead>
          <tr>
            <BotonOrden campo="id_cliente" orden={orden} manejarOrden={manejarOrden}>ID</BotonOrden>
            <BotonOrden campo="primer_nombre" orden={orden} manejarOrden={manejarOrden}>Primer Nombre</BotonOrden>
            <BotonOrden campo="primer_apellido" orden={orden} manejarOrden={manejarOrden}>Primer Apellido</BotonOrden>
            <th>Celular</th>
            <th>Cédula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientesOrdenados.map((cliente) => (
            <tr key={cliente.id_cliente}>
              <td>{cliente.id_cliente}</td>
              <td>{cliente.primer_nombre} {cliente.segundo_nombre}</td>
              <td>{cliente.primer_apellido} {cliente.segundo_apellido}</td>
              <td>{cliente.celular}</td>
              <td>{cliente.cedula}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(cliente)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(cliente)}
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

export default TablaClientes;