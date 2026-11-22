
import { Link } from 'react-router-dom';

function Navbar() {

    // =====================================
    // USUARIO AUTENTICADO
    // =====================================

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );

    // =====================================
    // CERRAR SESIÓN
    // =====================================

    const cerrarSesion = () => {

        localStorage.removeItem('token');

        localStorage.removeItem('usuario');

        window.location.href = '/';
    };

    // =====================================
    // ESTRUCTURA DEL NAVBAR
    // =====================================

    return (

        <div style={navbarStyle}>

            {/* INFORMACIÓN DEL USUARIO */}

            <div>

                <h3 style={nombreStyle}>
                    {usuario?.nombre}
                </h3>

                <p style={rolStyle}>
                    {usuario?.rol
                        ? usuario.rol.charAt(0).toUpperCase() +
                          usuario.rol.slice(1)
                        : ''}
                </p>

            </div>

            {/* BOTONES DE NAVEGACIÓN */}

            <div style={accionesStyle}>

                <Link
                    to="/"
                    style={volverHomeStyle}
                >
                    ← Volver al inicio
                </Link>

                <button
                    type="button"
                    onClick={cerrarSesion}
                    style={buttonStyle}
                >
                    Cerrar sesión
                </button>

            </div>

        </div>
    );
}


// =====================================
// ESTILOS DEL NAVBAR
// =====================================

const navbarStyle = {

    position: 'fixed',

    top: 0,

    right: 0,

    left: '260px',

    height: '80px',

    backgroundColor: '#111',

    borderBottom: '1px solid #d4af37',

    display: 'flex',

    justifyContent: 'space-between',

    alignItems: 'center',

    padding: '0 40px',

    zIndex: 999
};


// =====================================
// NOMBRE DEL USUARIO
// =====================================

const nombreStyle = {

    color: '#fff',

    margin: 0,

    fontSize: '20px',

    fontWeight: 'bold'
};


// =====================================
// ROL DEL USUARIO
// =====================================

const rolStyle = {

    color: '#d4af37',

    margin: 0,

    marginTop: '5px',

    fontSize: '14px',

    letterSpacing: '2px',

    borderBottom: '1px solid #d4af37',

    display: 'inline-block',

    paddingBottom: '3px'
};


// =====================================
// CONTENEDOR DE BOTONES
// =====================================

const accionesStyle = {

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'flex-end',

    gap: '12px',

    flexWrap: 'wrap'
};


// =====================================
// BOTÓN VOLVER AL INICIO
// =====================================

const volverHomeStyle = {

    backgroundColor: 'transparent',

    color: '#d4af37',

    border: '1px solid #d4af37',

    padding: '10px 18px',

    borderRadius: '10px',

    fontWeight: 'bold',

    fontSize: '14px',

    textDecoration: 'none',

    display: 'inline-block',

    textAlign: 'center',

    transition: '0.3s'
};


// =====================================
// BOTÓN CERRAR SESIÓN
// =====================================

const buttonStyle = {

    backgroundColor: '#d4af37',

    color: '#000',

    border: 'none',

    padding: '10px 20px',

    borderRadius: '10px',

    fontWeight: 'bold',

    cursor: 'pointer',

    transition: '0.3s'
};


export default Navbar;
