import {
    useEffect,
    useState
} from 'react';

import {
    obtenerPeluqueros
} from '../services/usuarioService';

import {
    obtenerFavorito,
    guardarFavorito,
    eliminarFavorito
} from '../services/favoritoService';


function FavoritosCliente() {

    const [peluqueros, setPeluqueros] =
        useState([]);

    const [favorito, setFavorito] =
        useState(null);

    const [cargando, setCargando] =
        useState(true);

    const [mensaje, setMensaje] =
        useState('');

    const [tipoMensaje, setTipoMensaje] =
        useState('');


    // =====================================
    // CARGAR DATOS
    // =====================================

    useEffect(() => {

        cargarDatos();

    }, []);


    const cargarDatos = async () => {

        try {

            setCargando(true);

            setMensaje('');

            // OBTENER PELUQUEROS

            const listaPeluqueros =
                await obtenerPeluqueros();

            setPeluqueros(
                listaPeluqueros
            );


            // OBTENER FAVORITO ACTUAL

            try {

                const favoritoActual =
                    await obtenerFavorito();

                setFavorito(
                    favoritoActual
                );

            } catch (error) {

                // 404 SIGNIFICA QUE TODAVÍA
                // NO TIENE FAVORITO

                if (
                    error.response?.status === 404
                ) {

                    setFavorito(null);

                } else {

                    throw error;

                }

            }

        } catch (error) {

            console.error(
                'Error al cargar favoritos:',
                error
            );

            setTipoMensaje('error');

            setMensaje(
                'No se pudieron cargar los profesionales.'
            );

        } finally {

            setCargando(false);

        }

    };


    // =====================================
    // SELECCIONAR FAVORITO
    // =====================================

    const seleccionarFavorito = async (
        peluquero
    ) => {

        const confirmar =
            window.confirm(
                `¿Querés elegir a ${peluquero.nombre} ${peluquero.apellido} como tu peluquero favorito?`
            );


        if (!confirmar) {

            return;

        }


        try {

            await guardarFavorito(
                peluquero.id
            );


            setTipoMensaje(
                'exito'
            );

            setMensaje(
                `⭐ ${peluquero.nombre} ahora es tu peluquero favorito.`
            );


            // VOLVER A CONSULTAR
            // EL FAVORITO DESDE LA BASE

            const favoritoActual =
                await obtenerFavorito();

            setFavorito(
                favoritoActual
            );


        } catch (error) {

            console.error(
                'Error al guardar favorito:',
                error
            );


            setTipoMensaje(
                'error'
            );

            setMensaje(
                error.response?.data?.mensaje ||
                'No se pudo guardar el favorito.'
            );

        }

    };


    // =====================================
    // QUITAR FAVORITO
    // =====================================

    const quitarFavorito = async () => {

        const confirmar =
            window.confirm(
                '¿Querés quitar tu peluquero favorito?'
            );


        if (!confirmar) {

            return;

        }


        try {

            await eliminarFavorito();


            setFavorito(null);

            setTipoMensaje(
                'exito'
            );

            setMensaje(
                'Favorito eliminado correctamente.'
            );


        } catch (error) {

            console.error(
                'Error al eliminar favorito:',
                error
            );


            setTipoMensaje(
                'error'
            );

            setMensaje(
                error.response?.data?.mensaje ||
                'No se pudo eliminar el favorito.'
            );

        }

    };


    // =====================================
    // SABER SI ES FAVORITO
    // =====================================

    const esFavorito = (
        peluqueroId
    ) => {

        return (
            favorito?.peluqueroId ===
            peluqueroId
        );

    };


    // =====================================
    // CARGANDO
    // =====================================

    if (cargando) {

        return (

            <div style={contenedorStyle}>

                <h2 style={tituloStyle}>
                    ⭐ Mi Peluquero Favorito
                </h2>

                <p style={textoStyle}>
                    Cargando profesionales...
                </p>

            </div>

        );

    }


    return (

        <div style={contenedorStyle}>

            {/* CABECERA */}

            <div style={cabeceraStyle}>

                <h2 style={tituloStyle}>
                    ⭐ Mi Peluquero Favorito
                </h2>

                <p style={textoStyle}>
                    Elegí al profesional que preferís
                    para tus próximas visitas.
                </p>

            </div>


            {/* MENSAJES */}

            {
                mensaje && (

                    <div
                        style={
                            tipoMensaje ===
                            'exito'
                                ? mensajeExitoStyle
                                : mensajeErrorStyle
                        }
                    >

                        {mensaje}

                    </div>

                )
            }


            {/* FAVORITO ACTUAL */}

            {
                favorito?.peluquero && (

                    <div style={favoritoActualStyle}>

                        <div>

                            <p style={etiquetaStyle}>
                                TU FAVORITO ACTUAL
                            </p>

                            <h3 style={favoritoNombreStyle}>

                                ⭐ {
                                    favorito
                                        .peluquero
                                        .nombre
                                } {
                                    favorito
                                        .peluquero
                                        .apellido
                                }

                            </h3>

                        </div>


                        <button
                            style={quitarButtonStyle}
                            onClick={
                                quitarFavorito
                            }
                        >
                            Quitar favorito
                        </button>

                    </div>

                )
            }


            {/* PROFESIONALES */}

            <h3 style={subtituloStyle}>
                Nuestros profesionales
            </h3>


            {
                peluqueros.length === 0
                    ? (

                        <p style={textoStyle}>
                            No hay peluqueros disponibles.
                        </p>

                    )
                    : (

                        <div style={gridStyle}>

                            {
                                peluqueros.map(
                                    (peluquero) => {

                                        const seleccionado =
                                            esFavorito(
                                                peluquero.id
                                            );


                                        return (

                                            <div
                                                key={
                                                    peluquero.id
                                                }
                                                style={{
                                                    ...cardStyle,

                                                    border:
                                                        seleccionado
                                                            ? '2px solid #d4af37'
                                                            : '1px solid #333'
                                                }}
                                            >

                                                {/* AVATAR */}

                                                <div style={avatarStyle}>

                                                    {
                                                        peluquero
                                                            .nombre
                                                            ?.charAt(0)
                                                            .toUpperCase()
                                                    }

                                                    {
                                                        peluquero
                                                            .apellido
                                                            ?.charAt(0)
                                                            .toUpperCase()
                                                    }

                                                </div>


                                                <h3 style={nombreStyle}>

                                                    {
                                                        peluquero.nombre
                                                    } {
                                                        peluquero.apellido
                                                    }

                                                </h3>


                                                <p style={rolStyle}>
                                                    Profesional Urban Fade
                                                </p>


                                                {
                                                    seleccionado
                                                        ? (

                                                            <div style={seleccionadoStyle}>
                                                                ⭐ Favorito
                                                            </div>

                                                        )
                                                        : (

                                                            <button
                                                                style={favoritoButtonStyle}
                                                                onClick={() =>
                                                                    seleccionarFavorito(
                                                                        peluquero
                                                                    )
                                                                }
                                                            >
                                                                Elegir favorito
                                                            </button>

                                                        )
                                                }

                                            </div>

                                        );

                                    }
                                )
                            }

                        </div>

                    )
            }

        </div>

    );

}


/* =====================================
   ESTILOS
===================================== */

const contenedorStyle = {

    backgroundColor: '#111',

    border: '1px solid #d4af37',

    borderRadius: '20px',

    padding: '30px'

};


const cabeceraStyle = {

    marginBottom: '25px'

};


const tituloStyle = {

    color: '#d4af37',

    marginTop: 0,

    marginBottom: '10px'

};


const subtituloStyle = {

    color: '#d4af37',

    marginTop: '30px',

    marginBottom: '20px'

};


const textoStyle = {

    color: '#aaa'

};


const favoritoActualStyle = {

    display: 'flex',

    justifyContent: 'space-between',

    alignItems: 'center',

    gap: '20px',

    flexWrap: 'wrap',

    backgroundColor: '#0b0b0b',

    border: '1px solid #d4af37',

    borderRadius: '15px',

    padding: '20px',

    marginTop: '20px'

};


const etiquetaStyle = {

    color: '#777',

    fontSize: '11px',

    letterSpacing: '2px',

    margin: 0

};


const favoritoNombreStyle = {

    color: '#fff',

    marginBottom: 0

};


const gridStyle = {

    display: 'grid',

    gridTemplateColumns:
        'repeat(auto-fit, minmax(220px, 1fr))',

    gap: '20px'

};


const cardStyle = {

    backgroundColor: '#0b0b0b',

    borderRadius: '18px',

    padding: '25px',

    textAlign: 'center'

};


const avatarStyle = {

    width: '65px',

    height: '65px',

    borderRadius: '50%',

    border: '2px solid #d4af37',

    color: '#d4af37',

    display: 'flex',

    justifyContent: 'center',

    alignItems: 'center',

    margin: '0 auto 15px',

    fontWeight: 'bold',

    fontSize: '20px'

};


const nombreStyle = {

    color: '#fff',

    marginBottom: '5px'

};


const rolStyle = {

    color: '#888',

    fontSize: '13px',

    marginBottom: '20px'

};


const favoritoButtonStyle = {

    backgroundColor: '#d4af37',

    color: '#000',

    border: 'none',

    borderRadius: '10px',

    padding: '10px 15px',

    cursor: 'pointer',

    fontWeight: 'bold'

};


const quitarButtonStyle = {

    backgroundColor: 'transparent',

    color: '#ff6666',

    border: '1px solid #ff4444',

    borderRadius: '10px',

    padding: '10px 15px',

    cursor: 'pointer'

};


const seleccionadoStyle = {

    color: '#d4af37',

    fontWeight: 'bold',

    padding: '10px'

};


const mensajeExitoStyle = {

    backgroundColor: '#12351b',

    border: '1px solid #00c853',

    color: '#65ff87',

    padding: '12px',

    borderRadius: '10px',

    marginBottom: '20px'

};


const mensajeErrorStyle = {

    backgroundColor: '#351515',

    border: '1px solid #ff3333',

    color: '#ff6b6b',

    padding: '12px',

    borderRadius: '10px',

    marginBottom: '20px'

};


export default FavoritosCliente;