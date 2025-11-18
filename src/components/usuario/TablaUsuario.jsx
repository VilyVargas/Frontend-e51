import { Table, Spinner, Button} from "react-bootstrap";
import { useState } from "react";
import BotonOrden from "../ordenamiento/BotonOrden";
import Paginacion from "../ordenamiento/Paginacion";

const TablaUsuarios = ({ usuarios, cargando, abrirModalEdicion, abrirModalEliminacion, totalElementos,elementosPorPagina,paginaActual,establecerPaginaActual}) => {

  const [orden, setOrden] = useState({ campo: "id_usuario", direccion: "asc" });

  const manejarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion:
        prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };

  const UsuariosOrdenados = [...usuarios].sort((a, b) => {
    const valorA = a[orden.campo];
    const valorB = b[orden.campo];

    if (typeof valorA === "number" && typeof valorB === "number") {
      return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
    }

    const comparacion = String(valorA).localeCompare(String(valorB));
    return orden.direccion === "asc" ? comparacion : -comparacion;
  });

  if (cargando) {
    return (
      <>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </>
    );
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <BotonOrden campo="id_usuario" orden={orden} manejarOrden={manejarOrden}>
              ID
            </BotonOrden>

            <BotonOrden campo="usuario" orden={orden} manejarOrden={manejarOrden}>
              Nombre usuario
            </BotonOrden>

            <BotonOrden campo="contraseña" orden={orden} manejarOrden={manejarOrden}>
              Contraseña
            </BotonOrden>

            <BotonOrden campo="" orden={orden} manejarOrden={manejarOrden}>
              Acciones
            </BotonOrden>

          </tr>
        </thead>
        <tbody>
          {UsuariosOrdenados.map((usuario) => {
            return (
              <tr key={usuario.id_usuario}>
                <td>{usuario.id_usuario}</td>
                <td>{usuario.usuario}</td>
                <td>{usuario.contraseña}</td>
                <td>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalEdicion(usuario)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(usuario)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>


                </td>
              </tr>
            );
          })}
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
}

export default TablaUsuarios;