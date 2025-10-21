import {useState, useEffect} from 'react';
import {container} from 'react-bootstrap';
import TablaCategorias from '../components/categorias/TablaCategorias';


const Categorias = () => {

  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerCategorias = async () => {

    try {

    } catch (error) {

    }
    
  }

  return(
    <>    
      <h2>Página de Categorias</h2>
    </>
  );

}


export default Categorias;