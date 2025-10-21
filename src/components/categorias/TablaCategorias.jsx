import {Table, Spinner} from "react-bootstrap";
import React from "react";

const TablaCategorias = ({categorias, cargando}) => {
  if (cargando) {
  return (
    <>  
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    </>
  );
}

return (
  <>
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre Categoria</th>
        <th>Descripcion Categoria</th>
      </tr>
    </thead>
    <tbody>
      {categorias.map((categoria) => {
        return (
          <tr key={categoria.id_categoria}>  
            <td>{categoria.id_categoria}</td>
            <td>{categoria.nombre_categoria}</td>
            <td>{categoria.descripcion_categoria}</td>
          </tr>
        );
      })
}
    </tbody>
  </Table>
  </>
);
}

export default TablaCategorias;

