import { useState, useEffect } from "react";
import TablaUsuario from "../components/usuario/TablaUsuario";
import { Container, Row, Col, Button } from "react-bootstrap";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroUsuario from "../components/usuario/ModalRegistroUsuario";
import ModalEdicionUsuario from "../components/usuario/ModalEdicionUsuario";
import ModalEliminarUsuario from "../components/usuario/ModalEliminacionUsuario";

const Usuarios = () => {

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  const [usuarioEditado, setUsuarioEditado] = useState(null);
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);

  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5; // Número de productos por página

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [usuariosFiltrados, setusuariosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: '',
    contraseña: ''
  });

  // Calcular productos paginados
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );


  const abrirModalEdicion = (usuario) => {
    setUsuarioEditado({ ...usuario });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!usuarioEditado.usuario.trim()) return;
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarusuario/${usuarioEditado.id_usuario}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioEditado)
      });
      if (!respuesta.ok) throw new Error('Error al actualizar');
      setMostrarModalEdicion(false);
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error al editar el usuario:", error);
      alert("No se pudo actualizar el usuario.");
    }
  };

  const abrirModalEliminacion = (usuario) => {
    setUsuarioEliminar(usuario);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarusuario/${usuarioEliminar.id_usuario}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) throw new Error('Error al eliminar');
      setMostrarModalEliminar(false);
      setUsuarioEliminar(null);
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      alert("No se pudo eliminar el usuario.");
    }
  };



  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario(prev => ({ ...prev, [name]: value }));
  };



  const agregarUsuario = async () => {
    if (!nuevoUsuario.usuario.trim()) return;
    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarUsuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
      });

      if (!respuesta.ok) throw new Error('Error al guardar');

      // Limpiar y cerrar
      setNuevoUsuario({ usuario: '', contraseña: '' });
      setMostrarModal(false);
      await obtenerUsuarios(); // Refresca la lista
    } catch (error) {
      console.error("Error al agregar Uusario:", error);
      alert("No se pudo guardar el usuario. Revisa la consola.");
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await fetch("http://localhost:3000/API/usuarios");
      if (!respuesta.ok) {
        throw new Error("Error al obtener los usuarios");
      }
      const datos = await respuesta.json();
      setUsuarios(datos);
      setusuariosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.long(error.message);
      setCargando(false);
    }
  }


  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = usuarios.filter(
      (usuario) =>
        usuario.usuario.toLowerCase().includes(texto) ||
        usuario.contraseña.toLowerCase().includes(texto)
    );
    setusuariosFiltrados(filtrados);
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    
    <Container className="mt-4">
        <h4>Usuarios</h4>

      <Row>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>

        <Col className="text-end">
          <Button
            variant="success"
            onClick={() => setMostrarModal(true)}
          >
            + Nueva Usuario
          </Button>
        </Col>

      </Row>
      
        <TablaUsuario
          usuarios={usuariosPaginados}
          cargando={cargando}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
          totalElementos={usuarios.length} // Total de categorias
          elementosPorPagina={elementosPorPagina} // Elementos por página
          paginaActual={paginaActual} // Página actual
          establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
        />

        <ModalRegistroUsuario
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoUsuario={nuevoUsuario}
          manejarCambioInput={manejarCambioInput}
          agregarUsuario={agregarUsuario}
        />

        <ModalEdicionUsuario
          mostrar={mostrarModalEdicion}
          setMostrar={setMostrarModalEdicion}
          usuarioEditado={usuarioEditado}
          setUsuarioEditado={setUsuarioEditado}
          guardarEdicion={guardarEdicion}
        />

        <ModalEliminarUsuario
          mostrar={mostrarModalEliminar}
          setMostrar={setMostrarModalEliminar}
          usuario={usuarioEliminar}
          confirmarEliminacion={confirmarEliminacion}
        />

      </Container>
    
  );
}
export default Usuarios;
