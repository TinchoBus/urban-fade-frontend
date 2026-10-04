function Navbar() {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );

    const cerrarSesion = () => {

        localStorage.removeItem('token');

        localStorage.removeItem('usuario');

        window.location.href = '/';
    };

    return (

        <div
            style={navbarStyle}
        >

            {/* USUARIO */}

            <div>

                <h3 style={nombreStyle}>

                    {
                        usuario?.nombre
                    }

                </h3>

                <p style={rolStyle}>

                    {
    usuario?.rol.charAt(0)
        .toUpperCase() +
    usuario?.rol.slice(1)
}

                </p>

            </div>

            {/* BOTON */}

            <button
                onClick={cerrarSesion}
                style={buttonStyle}
            >
                Cerrar sesión
            </button>

        </div>
    );
}


// ESTILOS

const navbarStyle = {

    position: 'fixed',

    top: 0,

    right: 0,

    left: '260px',

    height: '80px',

    backgroundColor: '#111',

    borderBottom:
        '1px solid #d4af37',

    display: 'flex',

    justifyContent:
        'space-between',

    alignItems: 'center',

    padding: '0 40px',

    zIndex: 999
};

const nombreStyle = {

    color: '#fff',

    margin: 0,

    fontSize: '20px',

    fontWeight: 'bold'
};

const rolStyle = {

    color: '#d4af37',

    margin: 0,

    marginTop: '5px',

    fontSize: '14px',

    letterSpacing: '2px',

    borderBottom:
        '1px solid #d4af37',

    display: 'inline-block',

    paddingBottom: '3px'
};

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