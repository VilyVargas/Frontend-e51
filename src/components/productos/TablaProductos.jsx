import React, { useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaProductos = ({
  productos,
  abrirModalEdicion,
  abrirModalEliminacion,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual
}) => {
  const [orden, setOrden] = useState({ campo: "id_producto", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion:
        prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const productosOrdenados = [...productos].sort((a, b) => {
    const valorA = a[orden.campo] ?? "";
    const valorB = b[orden.campo] ?? "";
    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }
    const comparacion = String(valorA).localeCompare(String(valorB));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (!productos.length) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <BotonOrden campo="id_producto" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>
            <BotonOrden campo="nombre_producto" orden={orden} manejarOrden={manejarOrden}>
              Nombre
            </BotonOrden>
            <BotonOrden campo="descripcion_producto" orden={orden} manejarOrden={manejarOrden}>
              Descripción
            </BotonOrden>
            <BotonOrden campo="id_categoria" orden={orden} manejarOrden={manejarOrden}>
              Categoría
            </BotonOrden>
            <BotonOrden campo="precio_unitario" orden={orden} manejarOrden={manejarOrden}>
              Precio (C$)
            </BotonOrden>
            <BotonOrden campo="stock" orden={orden} manejarOrden={manejarOrden}>
              Stock
            </BotonOrden>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosOrdenados.map((prod) => (
            <tr key={prod.id_producto}>
              <td>{prod.id_producto}</td>
              <td>{prod.nombre_producto}</td>
              <td>{prod.descripcion_producto}</td>
              <td>{prod.id_categoria}</td>
              <td>{prod.precio_unitario?.toFixed(2)}</td>
              <td>{prod.stock}</td>
              <td>
                {prod.imagen ? (
                  <img
                    src={`data:image/png;base64,${prod.imagen}`}
                    alt={prod.nombre_producto}
                    style={{ maxWidth: '100px' }}
                  />
                ) : (
                  'Sin imagen'
                )}
              </td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(prod)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(prod)}
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

export default TablaProductos;