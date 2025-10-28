import { useState, useEffect } from "react";
import TablaUsuarios from "../components/usuario/TablaUsuario";
import { Container, Col, Row, Button } from "react-bootstrap";
import ModalRegistroUsuario from "../components/usuario/ModalRegistroUsuario";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: "",
    contraseña: "",
  });

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const agregarUsuario = async () => {
    if (!nuevoUsuario.usuario.trim()) return;
    try {
      const respuesta = await fetch(
        "http://localhost:3000/api/registrarusuario",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoUsuario),
        }
      );

      if (!respuesta.ok) throw new Error("Error al guardar");

      // Limpiar y cerrar
      setNuevoUsuario({ usuario: "", contraseña: "" });
      setMostrarModal(false);
      await obtenerUsuarios(); // Refresca la lista
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
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
      setCargando(false);
    } catch (error) {
      console.long(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);
  return (
    <>
      <Container className="mt-4">
        <h4>Usuarios</h4>
        <Row>
          <Col className="text-end">
            <Button variant="primary" onClick={() => setMostrarModal(true)}>
              + Nuevo Usuario
            </Button>
          </Col>
        </Row>
        <TablaUsuarios usuarios={usuarios} cargando={cargando} />
        <ModalRegistroUsuario
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoUsuario={nuevoUsuario}
          manejarCambioInput={manejarCambioInput}
          agregarUsuario={agregarUsuario}
        />
      </Container>
    </>
  );
};
export default Usuarios;
