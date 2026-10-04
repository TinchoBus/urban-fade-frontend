import {
    useEffect,
    useState
} from 'react';

import api from '../services/api';

function UsersTable() {

    // USUARIO LOGUEADO

    const usuarioLogueado = JSON.parse(
        localStorage.getItem('usuario')
    );

    // STATES

    const [usuarios, setUsuarios] =
        useState([]);


    const [mostrarModal,
        setMostrarModal] =
        useState(false);

    const [modoEdicion,
        setModoEdicion] =
        useState(false);

    const [usuarioEditandoId,
        setUsuarioEditandoId] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [mensaje, setMensaje] =
        useState('');

    const [error, setError] =
        useState('');

    const [nombre, setNombre] =
        useState('');

    const [apellido, setApellido] =
        useState('');

    const [telefono, setTelefono] =
        useState('');

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [rol, setRol] =
        useState('cliente');

    // OBTENER USUARIOS

    useEffect(() => {

        obtenerUsuarios();

    }, []);

    // CERRAR MODAL CON TECLA ESCAPE

    useEffect(() => {

        const manejarEscape = (e) => {

            if (
                e.key === 'Escape' &&
                mostrarModal &&
                !loading
            ) {

                cerrarModal();

            }

        };

        window.addEventListener(
            'keydown',
            manejarEscape
        );

        return () => {

            window.removeEventListener(
                'keydown',
                manejarEscape
            );

        };

    }, [mostrarModal, loading]);


    // TOAST AUTO CLOSE

    useEffect(() => {

        if (mensaje || error) {

            const timer = setTimeout(() => {

                setMensaje('');
                setError('');

            }, 3000);

            return () => clearTimeout(timer);
        }

    }, [mensaje, error]);

    // GET USERS

    const obtenerUsuarios = async () => {

        try {

            const respuesta =
                await api.get('/usuarios');

            setUsuarios(
                respuesta.data
            );

        } catch (error) {

            console.log(error);
        }
    };

    // CREAR USUARIO

    const crearUsuario = async () => {

        setError('');
        setMensaje('');

        if (
            !nombre ||
            !apellido ||
            !telefono ||
            !email ||
            !password
        ) {

            setError(
                '⚠️ Todos los campos son obligatorios'
            );

            return;
        }

        const emailValido =
            /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/;

        if (!emailValido.test(email)) {

            setError(
                '❌ Email inválido'
            );

            return;
        }

        try {

            setLoading(true);

            await api.post(
                '/usuarios/registro',
                {
                    nombre,
                    apellido,
                    telefono,
                    email,
                    password,
                    rol
                }
            );

            setMensaje(
                '✅ Usuario creado correctamente'
            );

            cerrarModal();

            obtenerUsuarios();

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.mensaje ||
                '❌ Error al crear usuario'
            );

        } finally {

            setLoading(false);
        }
    };

    // ELIMINAR

    const eliminarUsuario = async (id) => {

        const confirmar =
            window.confirm(
                '¿Eliminar usuario?'
            );

        if (!confirmar) return;

        try {

            await api.delete(
                `/usuarios/eliminar/${id}`
            );

            setMensaje(
                '✅ Usuario eliminado'
            );

            obtenerUsuarios();

        } catch (error) {

            console.log(error);

            setError(
                '❌ No se pudo eliminar'
            );
        }
    };

    // ABRIR EDICION

    const abrirEdicion = (usuario) => {

        setModoEdicion(true);

        setUsuarioEditandoId(
            usuario.id
        );

        setNombre(usuario.nombre);

        setApellido(usuario.apellido);

        setTelefono(usuario.telefono);

        setEmail(usuario.email);

        setRol(usuario.rol);

        setMostrarModal(true);
    };

    // GUARDAR EDICION

    const guardarEdicion = async () => {

        try {

            setLoading(true);

            await api.put(
                `/usuarios/editar/${usuarioEditandoId}`,
                {
                    nombre,
                    apellido,
                    telefono,
                    email,
                    rol
                }
            );

            setMensaje(
                '✅ Usuario actualizado'
            );

            cerrarModal();

            obtenerUsuarios();

        } catch (error) {

            console.log(error);

            setError(
                '❌ Error al editar usuario'
            );

        } finally {

            setLoading(false);
        }
    };

    // CERRAR MODAL

    const cerrarModal = () => {

        setMostrarModal(false);

        setModoEdicion(false);

        setUsuarioEditandoId(null);

        setNombre('');

        setApellido('');

        setTelefono('');

        setEmail('');

        setPassword('');

        setRol('cliente');
    };

    return (

        <>

            {/* TOAST SUCCESS */}

            {
                mensaje && (

                    <div style={toastSuccess}>
                        {mensaje}
                    </div>
                )
            }

            {/* TOAST ERROR */}

            {
                error && (

                    <div style={toastError}>
                        {error}
                    </div>
                )
            }

            {/* CONTENEDOR */}

            <div style={containerStyle}>

                <div style={headerStyle}>

                    <h2 style={titleStyle}>
                        Usuarios registrados
                    </h2>

                    {
                        usuarioLogueado?.rol ===
                        'administrador' && (

                            <button
                                onClick={() =>
                                    setMostrarModal(true)
                                }
                                style={createButton}
                            >
                                + Nuevo usuario
                            </button>
                        )
                    }

                </div>

                {/* TABLA */}

                <table style={tableStyle}>

                    <thead>

                        <tr style={theadStyle}>

                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            usuarios.map((u) => (

                                <tr
                                    key={u.id}
                                    style={rowStyle}
                                >

                                    <td style={tdStyle}>
                                        {u.nombre}
                                    </td>

                                    <td style={tdStyle}>
                                        {u.email}
                                    </td>

                                    <td style={tdStyle}>
                                        {u.rol}
                                    </td>

                                    <td style={tdStyle}>

                                        {
                                            usuarioLogueado?.rol ===
                                            'administrador' && (

                                                <>

                                                    <button
                                                        style={editButton}
                                                        onClick={() =>
                                                            abrirEdicion(u)
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        style={deleteButton}
                                                        onClick={() =>
                                                            eliminarUsuario(u.id)
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>

                                                </>
                                            )
                                        }

                                    </td>

                                </tr>
                            ))
                        }

                    </tbody>

                </table>

            </div>

            {/* MODAL */}

            {
                mostrarModal && (

                    <div style={overlayStyle}>

                        <div style={modalStyle}>

                            <h2 style={modalTitle}>

                                {
                                    modoEdicion
                                        ? 'Editar usuario'
                                        : 'Crear usuario'
                                }

                            </h2>

                            <input
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) =>
                                    setNombre(e.target.value)
                                }
                                style={inputStyle}
                            />

                            <input
                                placeholder="Apellido"
                                value={apellido}
                                onChange={(e) =>
                                    setApellido(e.target.value)
                                }
                                style={inputStyle}
                            />

                            <input
                                placeholder="Teléfono"
                                value={telefono}
                                onChange={(e) =>
                                    setTelefono(e.target.value)
                                }
                                style={inputStyle}
                            />

                            <input
                                placeholder="Email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                style={inputStyle}
                            />

                            {
                                !modoEdicion && (

                                    <input
                                        type="password"
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        style={inputStyle}
                                    />
                                )
                            }

                            <select
                                value={rol}
                                onChange={(e) =>
                                    setRol(e.target.value)
                                }
                                style={inputStyle}
                            >

                                <option value="cliente">
                                    Cliente
                                </option>

                                <option value="peluquero">
                                    Peluquero
                                </option>

                                <option value="administrador">
                                    Administrador
                                </option>

                            </select>

                            <div style={buttonGroupStyle}>

                                <button
                                    style={saveButton}
                                    disabled={loading}
                                    onClick={
                                        modoEdicion
                                            ? guardarEdicion
                                            : crearUsuario
                                    }
                                >

                                    {
                                        loading
                                            ? 'Cargando...'
                                            : modoEdicion
                                                ? 'Guardar cambios'
                                                : 'Crear usuario'
                                    }

                                </button>

                                <button
                                    type="button"
                                    style={cancelButton}
                                    disabled={loading}
                                    onClick={cerrarModal}
                                >
                                    Cancelar
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }

        </>
    );
}

// ESTILOS

const containerStyle = {
    marginTop: '50px',
    backgroundColor: '#111',
    padding: '30px',
    borderRadius: '20px',
    border: '1px solid #d4af37'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '25px'
};

const titleStyle = {
    color: '#d4af37'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const theadStyle = {
    color: '#d4af37',
    textAlign: 'left'
};

const rowStyle = {
    borderTop: '1px solid #222'
};

const tdStyle = {
    padding: '18px 0',
    color: '#ddd'
};

const createButton = {
    backgroundColor: '#d4af37',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const editButton = {
    backgroundColor: '#d4af37',
    color: '#000',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    marginRight: '10px',
    cursor: 'pointer'
};

const deleteButton = {
    backgroundColor: '#a61d24',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer'
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
};

const modalStyle = {
    backgroundColor: '#111',
    padding: '30px',
    borderRadius: '20px',
    width: '400px',
    border: '1px solid #d4af37'
};

const modalTitle = {
    color: '#d4af37',
    marginBottom: '20px'
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '10px',
    border: '1px solid #333',
    backgroundColor: '#1a1a1a',
    color: '#fff'
};

const saveButton = {
    width: '100%',
    backgroundColor: '#d4af37',
    color: '#000',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const buttonGroupStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '5px'
};

const cancelButton = {
    width: '100%',
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #555',
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const toastSuccess = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#1f7a1f',
    color: '#fff',
    padding: '15px 20px',
    borderRadius: '10px',
    zIndex: 9999
};

const toastError = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#a61d24',
    color: '#fff',
    padding: '15px 20px',
    borderRadius: '10px',
    zIndex: 9999
};

export default UsersTable;