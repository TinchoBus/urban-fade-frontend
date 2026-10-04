import {
    useEffect,
    useMemo,
    useState
} from 'react';

import api from '../services/api';

const nombresDias = [
    'domingo',
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado'
];

const obtenerFechaLocal = (fechaObjeto = new Date()) => {

    const anio = fechaObjeto.getFullYear();

    const mes = String(
        fechaObjeto.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
        fechaObjeto.getDate()
    ).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
};

const crearFechaLocal = (fechaTexto) => {

    const [anio, mes, dia] =
        fechaTexto.split('-').map(Number);

    return new Date(
        anio,
        mes - 1,
        dia
    );
};

const convertirAMinutos = (horaTexto) => {

    if (!horaTexto) {
        return null;
    }

    const [horas, minutos] =
        horaTexto
            .slice(0, 5)
            .split(':')
            .map(Number);

    return horas * 60 + minutos;
};

const convertirAHora = (minutosTotales) => {

    const horas =
        Math.floor(minutosTotales / 60);

    const minutos =
        minutosTotales % 60;

    return (
        `${String(horas).padStart(2, '0')}:` +
        `${String(minutos).padStart(2, '0')}`
    );
};

const generarFranja = (
    horaInicio,
    horaFin,
    intervalo
) => {

    if (
        !horaInicio ||
        !horaFin
    ) {
        return [];
    }

    const inicio =
        convertirAMinutos(horaInicio);

    const fin =
        convertirAMinutos(horaFin);

    if (
        inicio === null ||
        fin === null ||
        inicio > fin
    ) {
        return [];
    }

    const horarios = [];

    for (
        let minuto = inicio;
        minuto <= fin;
        minuto += intervalo
    ) {
        horarios.push(
            convertirAHora(minuto)
        );
    }

    return horarios;
};

function TurnosTable() {

    const usuarioLogueado = JSON.parse(
        localStorage.getItem('usuario')
    );

    const [turnos, setTurnos] =
        useState([]);

    const [configuracion, setConfiguracion] =
        useState(null);

    const [horariosAtencion, setHorariosAtencion] =
        useState([]);

    const [cargandoConfiguracion,
        setCargandoConfiguracion] =
        useState(false);

    const [mostrarModal,
        setMostrarModal] =
        useState(false);

    const [modoEdicion,
        setModoEdicion] =
        useState(false);

    const [turnoEditandoId,
        setTurnoEditandoId] =
        useState(null);

    const [fecha, setFecha] =
        useState('');

    const [hora, setHora] =
        useState('');

    const [servicio, setServicio] =
        useState('');

    const [estado, setEstado] =
        useState('pendiente');

    const [mensaje, setMensaje] =
        useState('');

    const [error, setError] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    // CARGAR TURNOS Y CONFIGURACION DEL NEGOCIO

    useEffect(() => {

        obtenerTurnos();
        obtenerConfiguracionNegocio();

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

    // OBTENER CONFIGURACION Y HORARIOS SEMANALES

    const obtenerConfiguracionNegocio =
        async () => {

        try {

            setCargandoConfiguracion(true);

            const [
                respuestaConfiguracion,
                respuestaHorarios
            ] = await Promise.all([
                api.get('/configuracion'),
                api.get('/configuracion/horarios')
            ]);

            setConfiguracion(
                respuestaConfiguracion.data
            );

            setHorariosAtencion(
                respuestaHorarios.data
            );

        } catch (error) {

            console.log(error);

            setError(
                '❌ No se pudo cargar la configuración de horarios.'
            );

        } finally {

            setCargandoConfiguracion(false);
        }
    };

    const fechaMinima =
        obtenerFechaLocal();

    const fechaMaxima = useMemo(() => {

        const fechaLimite =
            new Date();

        const diasAnticipacion =
            Number(
                configuracion
                    ?.diasReservaAnticipada
            ) || 30;

        fechaLimite.setDate(
            fechaLimite.getDate() +
            diasAnticipacion
        );

        return obtenerFechaLocal(
            fechaLimite
        );

    }, [configuracion]);

    const horarioDelDia = useMemo(() => {

        if (
            !fecha ||
            horariosAtencion.length === 0
        ) {
            return null;
        }

        const fechaSeleccionada =
            crearFechaLocal(fecha);

        const nombreDia =
            nombresDias[
                fechaSeleccionada.getDay()
            ];

        return (
            horariosAtencion.find(
                (horario) =>
                    horario.diaSemana ===
                    nombreDia
            ) || null
        );

    }, [fecha, horariosAtencion]);

    const horariosDisponibles =
        useMemo(() => {

        if (
            !fecha ||
            !horarioDelDia ||
            !horarioDelDia.abierto ||
            !configuracion
        ) {
            return [];
        }

        const intervalo =
            Number(
                configuracion.intervaloTurnos
            ) || 15;

        const horariosManana =
            generarFranja(
                horarioDelDia
                    .horaInicioManana,
                horarioDelDia
                    .horaFinManana,
                intervalo
            );

        const horariosTarde =
            generarFranja(
                horarioDelDia
                    .horaInicioTarde,
                horarioDelDia
                    .horaFinTarde,
                intervalo
            );

        let horarios = [
            ...horariosManana,
            ...horariosTarde
        ];

        // Si estamos editando y el horario actual
        // todavía pertenece al turno, lo conservamos
        // visible aunque la configuración haya cambiado.
        if (
            modoEdicion &&
            hora &&
            !horarios.includes(
                hora.slice(0, 5)
            )
        ) {
            horarios.push(
                hora.slice(0, 5)
            );

            horarios.sort();
        }

        // Para turnos nuevos de hoy,
        // ocultamos horarios que ya pasaron.
        if (
            !modoEdicion &&
            fecha === obtenerFechaLocal()
        ) {

            const ahora =
                new Date();

            const minutosActuales =
                ahora.getHours() * 60 +
                ahora.getMinutes();

            horarios =
                horarios.filter(
                    (horario) =>
                        convertirAMinutos(
                            horario
                        ) >
                        minutosActuales
                );
        }

        return horarios;

    }, [
        fecha,
        horarioDelDia,
        configuracion,
        modoEdicion,
        hora
    ]);

    // GET TURNOS

    const obtenerTurnos = async () => {

        try {

            const respuesta =
                await api.get('/turnos');

            setTurnos(
                respuesta.data
            );

        } catch (error) {

            console.log(error);

            setError(
                '❌ Error al obtener turnos'
            );
        }
    };

    // VALIDAR FECHA Y HORA DEL TURNO

    const validarFechaTurno = () => {

        if (!configuracion) {

            setError(
                '⚠️ La configuración del negocio todavía no está disponible.'
            );

            return false;
        }

        if (
            configuracion.activo === false
        ) {

            setError(
                '⚠️ Urban Fade no está tomando reservas en este momento.'
            );

            return false;
        }

        if (fecha < fechaMinima) {

            setError(
                '⚠️ La fecha seleccionada ya pasó.'
            );

            return false;
        }

        if (fecha > fechaMaxima) {

            setError(
                `⚠️ Fecha fuera de rango. Solo podés reservar turnos dentro de los próximos ${configuracion.diasReservaAnticipada} días.`
            );

            return false;
        }

        if (!horarioDelDia) {

            setError(
                '⚠️ No existe una configuración de atención para la fecha seleccionada.'
            );

            return false;
        }

        if (!horarioDelDia.abierto) {

            setError(
                `⚠️ Urban Fade permanece cerrado los ${horarioDelDia.diaSemana}. Seleccioná otra fecha.`
            );

            return false;
        }

        if (
            !horariosDisponibles.includes(
                hora.slice(0, 5)
            )
        ) {

            setError(
                '⚠️ Seleccioná un horario válido dentro del horario de atención.'
            );

            return false;
        }

        return true;
    };

    // CREAR TURNO

    const crearTurno = async () => {

        setMensaje('');
        setError('');

        if (
            !fecha ||
            !hora ||
            !servicio
        ) {

            setError(
                '⚠️ Todos los campos son obligatorios'
            );

            return;
        }

        if (!validarFechaTurno()) {

            return;
        }

        try {

            setLoading(true);

            await api.post(
                '/turnos',
                {
                    fecha,
                    hora,
                    servicio
                }
            );

            setMensaje(
                '✅ Turno creado correctamente'
            );

            cerrarModal();

            obtenerTurnos();

        } catch (error) {

            console.log(error);

            const mensajeBackend =
                error.response?.data?.mensaje;

            setError(
                mensajeBackend
                    ? `❌ ${mensajeBackend}`
                    : '❌ Error al crear turno'
            );

        } finally {

            setLoading(false);
        }
    };

    // ELIMINAR TURNO

    const eliminarTurno = async (id) => {

        const confirmar =
            window.confirm(
                '¿Eliminar turno?'
            );

        if (!confirmar) return;

        try {

            await api.delete(
                `/turnos/${id}`
            );

            setMensaje(
                '✅ Turno eliminado'
            );

            obtenerTurnos();

        } catch (error) {

            console.log(error);

            setError(
                '❌ Error al eliminar turno'
            );
        }
    };

    // ABRIR EDICION

    const abrirEdicion = (turno) => {

        setModoEdicion(true);

        setTurnoEditandoId(
            turno.id
        );

        setFecha(turno.fecha);

        setHora(turno.hora);

        setServicio(turno.servicio);

        setEstado(turno.estado);

        setMostrarModal(true);
    };

    // GUARDAR EDICION

    const guardarEdicion =
        async () => {

        setMensaje('');
        setError('');

        if (
            estado !== 'cancelado' &&
            !validarFechaTurno()
        ) {
            return;
        }

        try {

            setLoading(true);

            await api.put(
                `/turnos/${turnoEditandoId}`,
                {
                    fecha,
                    hora,
                    servicio,
                    estado
                }
            );

            setMensaje(
                '✅ Turno actualizado'
            );

            cerrarModal();

            obtenerTurnos();

        } catch (error) {

            console.log(error);

            const mensajeBackend =
                error.response?.data?.mensaje;

            setError(
                mensajeBackend
                    ? `❌ ${mensajeBackend}`
                    : '❌ Error al editar turno'
            );

        } finally {

            setLoading(false);
        }
    };

    // CERRAR MODAL

    const cerrarModal = () => {

        setMostrarModal(false);

        setModoEdicion(false);

        setTurnoEditandoId(null);

        setFecha('');

        setHora('');

        setServicio('');

        setEstado('pendiente');
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
                        Gestión de Turnos
                    </h2>

                    <button
                        style={createButton}
                        onClick={() =>
                            setMostrarModal(true)
                        }
                    >
                        + Nuevo Turno
                    </button>

                </div>

                {/* TABLA */}

                <table style={tableStyle}>

                    <thead>

                        <tr style={theadStyle}>

                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Servicio</th>
                            <th>Estado</th>
                            <th>Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            turnos.map((t) => (

                                <tr
                                    key={t.id}
                                    style={rowStyle}
                                >

                                    <td style={tdStyle}>
                                        {t.fecha}
                                    </td>

                                    <td style={tdStyle}>
                                        {t.hora}
                                    </td>

                                    <td style={tdStyle}>
                                        {t.servicio}
                                    </td>

                                    <td style={tdStyle}>

                                        <span
                                            style={{
                                                color:
                                                    t.estado ===
                                                    'finalizado'
                                                        ? '#00ff88'
                                                        : t.estado ===
                                                    'cancelado'
                                                        ? '#ff4d4d'
                                                        : '#d4af37',

                                                fontWeight: 'bold'
                                            }}
                                        >

                                            {t.estado}

                                        </span>

                                    </td>

                                    <td style={tdStyle}>

                                        {
                                            usuarioLogueado?.rol ===
                                            'administrador' && (

                                                <>

                                                    <button
                                                        style={editButton}
                                                        onClick={() =>
                                                            abrirEdicion(t)
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        style={deleteButton}
                                                        onClick={() =>
                                                            eliminarTurno(t.id)
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
                                        ? 'Editar Turno'
                                        : 'Nuevo Turno'
                                }

                            </h2>

                            <input
                                type="date"
                                value={fecha}
                                min={fechaMinima}
                                max={fechaMaxima}
                                onChange={(e) => {

                                    setFecha(
                                        e.target.value
                                    );

                                    setHora('');
                                    setError('');
                                }}
                                style={inputStyle}
                            />

                            {
                                fecha &&
                                horarioDelDia &&
                                !horarioDelDia.abierto && (

                                    <div style={scheduleWarningStyle}>
                                        Urban Fade permanece cerrado los{' '}
                                        {horarioDelDia.diaSemana}.
                                    </div>
                                )
                            }

                            <select
                                value={
                                    hora
                                        ? hora.slice(0, 5)
                                        : ''
                                }
                                onChange={(e) =>
                                    setHora(
                                        e.target.value
                                    )
                                }
                                style={inputStyle}
                                disabled={
                                    cargandoConfiguracion ||
                                    !fecha ||
                                    !horarioDelDia ||
                                    !horarioDelDia.abierto
                                }
                            >

                                <option value="">
                                    {
                                        cargandoConfiguracion
                                            ? 'Cargando horarios...'
                                            : !fecha
                                                ? 'Seleccioná primero una fecha'
                                                : !horarioDelDia
                                                    ? 'Sin configuración para este día'
                                                    : !horarioDelDia.abierto
                                                        ? 'Día cerrado'
                                                        : horariosDisponibles.length === 0
                                                            ? 'No hay horarios disponibles'
                                                            : 'Seleccioná un horario'
                                    }
                                </option>

                                {
                                    horariosDisponibles.map(
                                        (horarioDisponible) => (

                                            <option
                                                key={horarioDisponible}
                                                value={horarioDisponible}
                                            >
                                                {horarioDisponible}
                                            </option>
                                        )
                                    )
                                }

                            </select>

     <select
    value={servicio}
    onChange={(e) =>
        setServicio(e.target.value)
    }
    style={inputStyle}
>
    <option value="">
        Seleccioná un servicio
    </option>

    <option value="Corte Clásico">
        ✂️ Corte Clásico
    </option>

    <option value="Fade">
        🔥 Fade
    </option>

    <option value="Corte + Barba">
        🧔 Corte + Barba
    </option>

    <option value="Corte Infantil">
        👦 Corte Infantil
    </option>
            </select>

                            {
                                modoEdicion && (

                                    <select
                                        value={estado}
                                        onChange={(e) =>
                                            setEstado(
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    >

                                        <option value="pendiente">
                                            Pendiente
                                        </option>

                                        <option value="confirmado">
                                            Confirmado
                                        </option>

                                        <option value="cancelado">
                                            Cancelado
                                        </option>

                                        <option value="finalizado">
                                            Finalizado
                                        </option>

                                    </select>
                                )
                            }

                            <div style={buttonGroupStyle}>

                                <button
                                    style={saveButton}
                                    disabled={loading}
                                    onClick={
                                        modoEdicion
                                            ? guardarEdicion
                                            : crearTurno
                                    }
                                >

                                    {
                                        loading
                                            ? 'Cargando...'
                                            : modoEdicion
                                                ? 'Guardar Cambios'
                                                : 'Crear Turno'
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


const scheduleWarningStyle = {
    color: '#ff7777',
    fontSize: '13px',
    marginTop: '-5px',
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#241414',
    border: '1px solid #5a2222'
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

export default TurnosTable;