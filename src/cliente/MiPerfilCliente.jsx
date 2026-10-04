import {
    useEffect,
    useState
} from 'react';

import {
    obtenerPerfil,
    editarPerfil
} from '../services/usuarioService';


function MiPerfilCliente() {

    const [nombre, setNombre] =
        useState('');

    const [apellido, setApellido] =
        useState('');

    const [telefono, setTelefono] =
        useState('');

    const [email, setEmail] =
        useState('');

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [modoEdicion, setModoEdicion] =
        useState(false);

    const [mensaje, setMensaje] =
        useState('');

    const [tipoMensaje, setTipoMensaje] =
        useState('');

    const [datosOriginales, setDatosOriginales] =
        useState(null);


    // =====================================
    // CARGAR PERFIL
    // =====================================

    useEffect(() => {

        cargarPerfil();

    }, []);


    const cargarPerfil = async () => {

        try {

            setCargando(true);

            setMensaje('');

            const respuesta =
                await obtenerPerfil();

            const usuario =
                respuesta.usuario;

            if (!usuario) {

                setTipoMensaje('error');

                setMensaje(
                    'No se pudieron obtener los datos del perfil.'
                );

                return;
            }

            setNombre(
                usuario.nombre || ''
            );

            setApellido(
                usuario.apellido || ''
            );

            setTelefono(
                usuario.telefono || ''
            );

            setEmail(
                usuario.email || ''
            );

            setDatosOriginales({
                nombre:
                    usuario.nombre || '',
                apellido:
                    usuario.apellido || '',
                telefono:
                    usuario.telefono || '',
                email:
                    usuario.email || ''
            });

        } catch (error) {

            console.error(
                'Error al cargar perfil:',
                error
            );

            setTipoMensaje('error');

            setMensaje(
                error.response?.data?.mensaje ||
                'No se pudo cargar el perfil.'
            );

        } finally {

            setCargando(false);

        }

    };


    // =====================================
    // ACTIVAR EDICION
    // =====================================

    const activarEdicion = () => {

        setMensaje('');

        setTipoMensaje('');

        setModoEdicion(true);

    };


    // =====================================
    // CANCELAR EDICION
    // =====================================

    const cancelarEdicion = () => {

        if (datosOriginales) {

            setNombre(
                datosOriginales.nombre
            );

            setApellido(
                datosOriginales.apellido
            );

            setTelefono(
                datosOriginales.telefono
            );

            setEmail(
                datosOriginales.email
            );

        }

        setMensaje('');

        setTipoMensaje('');

        setModoEdicion(false);

    };


    // =====================================
    // VALIDAR FORMULARIO
    // =====================================

    const validarFormulario = () => {

        if (
            !nombre.trim() ||
            !apellido.trim() ||
            !email.trim()
        ) {

            setTipoMensaje('error');

            setMensaje(
                '🔴 Nombre, apellido y email son obligatorios.'
            );

            return false;
        }


        const formatoEmail =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!formatoEmail.test(email)) {

            setTipoMensaje('error');

            setMensaje(
                '🔴 Ingresá un email válido.'
            );

            return false;
        }


        if (
            telefono &&
            telefono.length < 6
        ) {

            setTipoMensaje('error');

            setMensaje(
                '🔴 Ingresá un teléfono válido.'
            );

            return false;
        }


        return true;

    };


    // =====================================
    // GUARDAR CAMBIOS
    // =====================================

    const guardarCambios = async () => {

        setMensaje('');

        setTipoMensaje('');


        if (!validarFormulario()) {

            return;

        }


        const confirmar =
            window.confirm(
                '¿Está seguro de que desea guardar los cambios en su perfil?'
            );


        if (!confirmar) {

            return;

        }


        try {

            setGuardando(true);


            const datos = {

                nombre:
                    nombre.trim(),

                apellido:
                    apellido.trim(),

                telefono:
                    telefono.trim(),

                email:
                    email.trim()

            };


            const respuesta =
                await editarPerfil(
                    datos
                );


            const usuarioActualizado =
                respuesta.usuario;


            // =====================================
            // ACTUALIZAR LOCALSTORAGE
            // =====================================

            const usuarioLocal =
                JSON.parse(
                    localStorage.getItem(
                        'usuario'
                    )
                ) || {};


            const nuevoUsuarioLocal = {

                ...usuarioLocal,

                nombre:
                    usuarioActualizado.nombre,

                apellido:
                    usuarioActualizado.apellido,

                email:
                    usuarioActualizado.email,

                telefono:
                    usuarioActualizado.telefono

            };


            localStorage.setItem(
                'usuario',
                JSON.stringify(
                    nuevoUsuarioLocal
                )
            );


            setDatosOriginales({

                nombre:
                    usuarioActualizado.nombre || '',

                apellido:
                    usuarioActualizado.apellido || '',

                telefono:
                    usuarioActualizado.telefono || '',

                email:
                    usuarioActualizado.email || ''

            });


            setNombre(
                usuarioActualizado.nombre || ''
            );

            setApellido(
                usuarioActualizado.apellido || ''
            );

            setTelefono(
                usuarioActualizado.telefono || ''
            );

            setEmail(
                usuarioActualizado.email || ''
            );


            setTipoMensaje('exito');

            setMensaje(
                '🟢 Perfil actualizado correctamente.'
            );


            setModoEdicion(false);


        } catch (error) {

            console.error(
                'Error al guardar perfil:',
                error
            );


            setTipoMensaje('error');


            setMensaje(
                `🔴 ${
                    error.response?.data?.mensaje ||
                    'No se pudo actualizar el perfil.'
                }`
            );


        } finally {

            setGuardando(false);

        }

    };


    // =====================================
    // CARGANDO
    // =====================================

    if (cargando) {

        return (

            <div style={contenedorStyle}>

                <h2 style={tituloStyle}>
                    👤 Mi Perfil
                </h2>

                <p style={textoStyle}>
                    Cargando tus datos...
                </p>

            </div>

        );

    }


    return (

        <div style={contenedorStyle}>

            {/* CABECERA */}

            <div style={cabeceraStyle}>

                <div>

                    <p style={etiquetaStyle}>
                        DATOS PERSONALES
                    </p>

                    <h2 style={tituloStyle}>
                        👤 Mi Perfil
                    </h2>

                    <p style={subtituloStyle}>
                        Consultá y actualizá tus datos personales.
                    </p>

                </div>


                {
                    !modoEdicion && (

                        <button
                            style={editarButtonStyle}
                            onClick={
                                activarEdicion
                            }
                        >
                            Editar perfil
                        </button>

                    )
                }

            </div>


            {/* MENSAJE */}

            {
                mensaje && (

                    <div
                        style={
                            tipoMensaje === 'exito'
                                ? mensajeExitoStyle
                                : mensajeErrorStyle
                        }
                    >
                        {mensaje}
                    </div>

                )
            }


            {/* AVATAR */}

            <div style={avatarContenedorStyle}>

                <div style={avatarStyle}>

                    {
                        nombre
                            ?.charAt(0)
                            .toUpperCase()
                    }

                    {
                        apellido
                            ?.charAt(0)
                            .toUpperCase()
                    }

                </div>


                <div>

                    <h3 style={nombreCompletoStyle}>
                        {nombre} {apellido}
                    </h3>

                    <p style={rolStyle}>
                        Cliente Urban Fade
                    </p>

                </div>

            </div>


            {/* FORMULARIO */}

            <div style={formularioStyle}>

                <div style={campoStyle}>

                    <label style={labelStyle}>
                        Nombre
                    </label>

                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(
                                e.target.value
                            )
                        }
                        disabled={
                            !modoEdicion ||
                            guardando
                        }
                        style={
                            modoEdicion
                                ? inputStyle
                                : inputBloqueadoStyle
                        }
                    />

                </div>


                <div style={campoStyle}>

                    <label style={labelStyle}>
                        Apellido
                    </label>

                    <input
                        type="text"
                        value={apellido}
                        onChange={(e) =>
                            setApellido(
                                e.target.value
                            )
                        }
                        disabled={
                            !modoEdicion ||
                            guardando
                        }
                        style={
                            modoEdicion
                                ? inputStyle
                                : inputBloqueadoStyle
                        }
                    />

                </div>


                <div style={campoStyle}>

                    <label style={labelStyle}>
                        Teléfono
                    </label>

                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) =>
                            setTelefono(
                                e.target.value
                            )
                        }
                        disabled={
                            !modoEdicion ||
                            guardando
                        }
                        placeholder="Ingresá tu teléfono"
                        style={
                            modoEdicion
                                ? inputStyle
                                : inputBloqueadoStyle
                        }
                    />

                </div>


                <div style={campoStyle}>

                    <label style={labelStyle}>
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        disabled={
                            !modoEdicion ||
                            guardando
                        }
                        style={
                            modoEdicion
                                ? inputStyle
                                : inputBloqueadoStyle
                        }
                    />

                </div>

            </div>


            {/* BOTONES */}

            {
                modoEdicion && (

                    <div style={botonesStyle}>

                        <button
                            style={guardarButtonStyle}
                            onClick={
                                guardarCambios
                            }
                            disabled={guardando}
                        >
                            {
                                guardando
                                    ? 'Guardando...'
                                    : 'Guardar cambios'
                            }
                        </button>


                        <button
                            style={cancelarButtonStyle}
                            onClick={
                                cancelarEdicion
                            }
                            disabled={guardando}
                        >
                            Cancelar
                        </button>

                    </div>

                )
            }


            {/* SEGURIDAD */}

            <div style={seguridadStyle}>

                <h3 style={seguridadTituloStyle}>
                    🔒 Seguridad de la cuenta
                </h3>

                <p style={seguridadTextoStyle}>
                    Desde esta sección solo podés modificar
                    tus datos personales. Los permisos,
                    rol y configuraciones internas de la
                    cuenta están protegidos por el sistema.
                </p>

            </div>

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

    padding: '30px',

    marginTop: '20px'

};


const cabeceraStyle = {

    display: 'flex',

    justifyContent: 'space-between',

    alignItems: 'center',

    gap: '20px',

    flexWrap: 'wrap',

    marginBottom: '30px'

};


const etiquetaStyle = {

    color: '#777',

    fontSize: '11px',

    letterSpacing: '2px',

    marginBottom: '8px'

};


const tituloStyle = {

    color: '#d4af37',

    marginTop: 0,

    marginBottom: '8px'

};


const subtituloStyle = {

    color: '#aaa',

    margin: 0

};


const textoStyle = {

    color: '#aaa'

};


const editarButtonStyle = {

    backgroundColor: '#d4af37',

    color: '#000',

    border: 'none',

    borderRadius: '10px',

    padding: '11px 18px',

    fontWeight: 'bold',

    cursor: 'pointer'

};


const avatarContenedorStyle = {

    display: 'flex',

    alignItems: 'center',

    gap: '18px',

    padding: '20px',

    marginBottom: '30px',

    backgroundColor: '#0b0b0b',

    borderRadius: '15px',

    border: '1px solid #222'

};


const avatarStyle = {

    width: '70px',

    height: '70px',

    borderRadius: '50%',

    border: '2px solid #d4af37',

    color: '#d4af37',

    display: 'flex',

    justifyContent: 'center',

    alignItems: 'center',

    fontWeight: 'bold',

    fontSize: '22px'

};


const nombreCompletoStyle = {

    color: '#fff',

    marginTop: 0,

    marginBottom: '5px'

};


const rolStyle = {

    color: '#888',

    margin: 0,

    fontSize: '13px'

};


const formularioStyle = {

    display: 'grid',

    gridTemplateColumns:
        'repeat(auto-fit, minmax(240px, 1fr))',

    gap: '20px'

};


const campoStyle = {

    display: 'flex',

    flexDirection: 'column'

};


const labelStyle = {

    color: '#d4af37',

    fontWeight: 'bold',

    marginBottom: '8px',

    fontSize: '13px'

};


const inputStyle = {

    padding: '13px',

    borderRadius: '10px',

    border: '1px solid #d4af37',

    backgroundColor: '#1a1a1a',

    color: '#fff',

    outline: 'none',

    fontSize: '14px'

};


const inputBloqueadoStyle = {

    ...inputStyle,

    border: '1px solid #333',

    color: '#aaa',

    cursor: 'default'

};


const botonesStyle = {

    display: 'flex',

    gap: '12px',

    flexWrap: 'wrap',

    marginTop: '25px'

};


const guardarButtonStyle = {

    backgroundColor: '#d4af37',

    color: '#000',

    border: 'none',

    borderRadius: '10px',

    padding: '12px 18px',

    fontWeight: 'bold',

    cursor: 'pointer'

};


const cancelarButtonStyle = {

    backgroundColor: '#333',

    color: '#fff',

    border: 'none',

    borderRadius: '10px',

    padding: '12px 18px',

    cursor: 'pointer'

};


const mensajeExitoStyle = {

    backgroundColor: '#12351b',

    border: '1px solid #00c853',

    color: '#65ff87',

    padding: '13px',

    borderRadius: '10px',

    marginBottom: '20px',

    fontWeight: 'bold'

};


const mensajeErrorStyle = {

    backgroundColor: '#351515',

    border: '1px solid #ff3333',

    color: '#ff6b6b',

    padding: '13px',

    borderRadius: '10px',

    marginBottom: '20px',

    fontWeight: 'bold'

};


const seguridadStyle = {

    marginTop: '30px',

    padding: '20px',

    backgroundColor: '#0b0b0b',

    borderLeft: '3px solid #d4af37',

    borderRadius: '10px'

};


const seguridadTituloStyle = {

    color: '#d4af37',

    marginTop: 0,

    marginBottom: '8px',

    fontSize: '15px'

};


const seguridadTextoStyle = {

    color: '#888',

    margin: 0,

    lineHeight: '1.6',

    fontSize: '13px'

};


export default MiPerfilCliente;