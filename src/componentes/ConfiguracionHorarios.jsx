import {
    useEffect,
    useState
} from 'react';

import api from '../services/api';


const ordenDias = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
    'domingo'
];


const nombresVisibles = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo'
};


function ConfiguracionHorarios() {

    const [horarios, setHorarios] =
        useState([]);

    const [cargando, setCargando] =
        useState(true);

    const [guardandoId, setGuardandoId] =
        useState(null);

    const [mensaje, setMensaje] =
        useState('');

    const [error, setError] =
        useState('');


    useEffect(() => {

        obtenerHorarios();

    }, []);


    useEffect(() => {

        if (!mensaje && !error) {
            return;
        }

        const timer = setTimeout(() => {

            setMensaje('');
            setError('');

        }, 3500);

        return () => clearTimeout(timer);

    }, [mensaje, error]);


    const obtenerHorarios = async () => {

        try {

            setCargando(true);
            setError('');

            const respuesta =
                await api.get(
                    '/configuracion/horarios'
                );

            const horariosOrdenados = [
                ...respuesta.data
            ].sort(
                (a, b) =>
                    ordenDias.indexOf(
                        a.diaSemana
                    ) -
                    ordenDias.indexOf(
                        b.diaSemana
                    )
            );

            setHorarios(
                horariosOrdenados
            );

        } catch (error) {

            console.log(error);

            setError(
                '❌ No se pudieron cargar los horarios de atención.'
            );

        } finally {

            setCargando(false);
        }
    };


    const actualizarCampo = (
        id,
        campo,
        valor
    ) => {

        setHorarios((anteriores) =>

            anteriores.map((horario) => {

                if (horario.id !== id) {
                    return horario;
                }

                if (
                    campo === 'abierto' &&
                    valor === false
                ) {

                    return {
                        ...horario,
                        abierto: false,
                        horaInicioManana: '',
                        horaFinManana: '',
                        horaInicioTarde: '',
                        horaFinTarde: ''
                    };
                }

                return {
                    ...horario,
                    [campo]: valor
                };
            })
        );
    };


    const validarFranja = (
        inicio,
        fin,
        nombreFranja
    ) => {

        const tieneInicio = Boolean(inicio);
        const tieneFin = Boolean(fin);

        if (tieneInicio !== tieneFin) {

            setError(
                `⚠️ Completá inicio y fin del turno ${nombreFranja}.`
            );

            return false;
        }

        if (
            tieneInicio &&
            tieneFin &&
            inicio >= fin
        ) {

            setError(
                `⚠️ En el turno ${nombreFranja}, la hora de inicio debe ser anterior a la hora de fin.`
            );

            return false;
        }

        return true;
    };


    const guardarHorario = async (horario) => {

        setMensaje('');
        setError('');

        if (horario.abierto) {

            const mananaValida =
                validarFranja(
                    horario.horaInicioManana,
                    horario.horaFinManana,
                    'mañana'
                );

            if (!mananaValida) {
                return;
            }

            const tardeValida =
                validarFranja(
                    horario.horaInicioTarde,
                    horario.horaFinTarde,
                    'tarde'
                );

            if (!tardeValida) {
                return;
            }

            const tieneManana =
                horario.horaInicioManana &&
                horario.horaFinManana;

            const tieneTarde =
                horario.horaInicioTarde &&
                horario.horaFinTarde;

            if (!tieneManana && !tieneTarde) {

                setError(
                    '⚠️ Un día abierto debe tener al menos una franja horaria configurada.'
                );

                return;
            }
        }

        try {

            setGuardandoId(
                horario.id
            );

            const datos = horario.abierto
                ? {
                    abierto: true,
                    horaInicioManana:
                        horario.horaInicioManana || null,
                    horaFinManana:
                        horario.horaFinManana || null,
                    horaInicioTarde:
                        horario.horaInicioTarde || null,
                    horaFinTarde:
                        horario.horaFinTarde || null
                }
                : {
                    abierto: false
                };

            await api.put(
                `/configuracion/horarios/${horario.id}`,
                datos
            );

            setMensaje(
                `✅ Horario de ${nombresVisibles[horario.diaSemana]} actualizado correctamente.`
            );

            await obtenerHorarios();

        } catch (error) {

            console.log(error);

            const mensajeBackend =
                error.response?.data?.mensaje;

            setError(
                mensajeBackend
                    ? `❌ ${mensajeBackend}`
                    : '❌ No se pudo actualizar el horario.'
            );

        } finally {

            setGuardandoId(null);
        }
    };


    if (cargando) {

        return (
            <div style={estadoCargaStyle}>
                Cargando horarios de atención...
            </div>
        );
    }


    return (

        <div>

            {
                mensaje && (
                    <div style={toastSuccess}>
                        {mensaje}
                    </div>
                )
            }

            {
                error && (
                    <div style={toastError}>
                        {error}
                    </div>
                )
            }


            <div style={encabezadoStyle}>

                <div>

                    <p style={etiquetaStyle}>
                        CONFIGURACIÓN DEL NEGOCIO
                    </p>

                    <h2 style={tituloStyle}>
                        Horarios de atención
                    </h2>

                    <p style={descripcionStyle}>
                        Definí qué días trabaja Urban Fade y las franjas
                        horarias disponibles para reservar turnos.
                    </p>

                </div>

            </div>


            <div style={listaStyle}>

                {
                    horarios.map((horario) => (

                        <div
                            key={horario.id}
                            style={cardStyle}
                        >

                            <div style={cabeceraDiaStyle}>

                                <div>

                                    <h3 style={diaStyle}>
                                        {nombresVisibles[horario.diaSemana]}
                                    </h3>

                                    <span
                                        style={
                                            horario.abierto
                                                ? estadoAbiertoStyle
                                                : estadoCerradoStyle
                                        }
                                    >
                                        {
                                            horario.abierto
                                                ? 'Abierto'
                                                : 'Cerrado'
                                        }
                                    </span>

                                </div>


                                <label style={toggleLabelStyle}>

                                    <input
                                        type="checkbox"
                                        checked={Boolean(horario.abierto)}
                                        onChange={(e) =>
                                            actualizarCampo(
                                                horario.id,
                                                'abierto',
                                                e.target.checked
                                            )
                                        }
                                        style={checkboxStyle}
                                    />

                                    <span>
                                        Atender este día
                                    </span>

                                </label>

                            </div>


                            {
                                horario.abierto && (

                                    <div style={franjasStyle}>

                                        <div style={franjaStyle}>

                                            <h4 style={franjaTituloStyle}>
                                                Mañana
                                            </h4>

                                            <div style={horasStyle}>

                                                <div style={campoStyle}>

                                                    <label style={labelStyle}>
                                                        Desde
                                                    </label>

                                                    <input
                                                        type="time"
                                                        value={
                                                            horario.horaInicioManana
                                                                ? horario.horaInicioManana.slice(0, 5)
                                                                : ''
                                                        }
                                                        onChange={(e) =>
                                                            actualizarCampo(
                                                                horario.id,
                                                                'horaInicioManana',
                                                                e.target.value
                                                            )
                                                        }
                                                        style={inputStyle}
                                                    />

                                                </div>

                                                <div style={campoStyle}>

                                                    <label style={labelStyle}>
                                                        Hasta
                                                    </label>

                                                    <input
                                                        type="time"
                                                        value={
                                                            horario.horaFinManana
                                                                ? horario.horaFinManana.slice(0, 5)
                                                                : ''
                                                        }
                                                        onChange={(e) =>
                                                            actualizarCampo(
                                                                horario.id,
                                                                'horaFinManana',
                                                                e.target.value
                                                            )
                                                        }
                                                        style={inputStyle}
                                                    />

                                                </div>

                                            </div>

                                        </div>


                                        <div style={franjaStyle}>

                                            <h4 style={franjaTituloStyle}>
                                                Tarde
                                            </h4>

                                            <div style={horasStyle}>

                                                <div style={campoStyle}>

                                                    <label style={labelStyle}>
                                                        Desde
                                                    </label>

                                                    <input
                                                        type="time"
                                                        value={
                                                            horario.horaInicioTarde
                                                                ? horario.horaInicioTarde.slice(0, 5)
                                                                : ''
                                                        }
                                                        onChange={(e) =>
                                                            actualizarCampo(
                                                                horario.id,
                                                                'horaInicioTarde',
                                                                e.target.value
                                                            )
                                                        }
                                                        style={inputStyle}
                                                    />

                                                </div>

                                                <div style={campoStyle}>

                                                    <label style={labelStyle}>
                                                        Hasta
                                                    </label>

                                                    <input
                                                        type="time"
                                                        value={
                                                            horario.horaFinTarde
                                                                ? horario.horaFinTarde.slice(0, 5)
                                                                : ''
                                                        }
                                                        onChange={(e) =>
                                                            actualizarCampo(
                                                                horario.id,
                                                                'horaFinTarde',
                                                                e.target.value
                                                            )
                                                        }
                                                        style={inputStyle}
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                )
                            }


                            <div style={accionesStyle}>

                                <button
                                    onClick={() =>
                                        guardarHorario(horario)
                                    }
                                    disabled={
                                        guardandoId === horario.id
                                    }
                                    style={guardarButtonStyle}
                                >
                                    {
                                        guardandoId === horario.id
                                            ? 'Guardando...'
                                            : 'Guardar cambios'
                                    }
                                </button>

                            </div>

                        </div>
                    ))
                }

            </div>

        </div>
    );
}


const encabezadoStyle = {
    backgroundColor: '#111',
    border: '1px solid #292929',
    borderRadius: '18px',
    padding: '25px',
    marginBottom: '22px'
};

const etiquetaStyle = {
    color: '#888',
    fontSize: '12px',
    letterSpacing: '3px',
    marginTop: 0,
    marginBottom: '8px'
};

const tituloStyle = {
    color: '#d4af37',
    margin: '0 0 10px 0'
};

const descripcionStyle = {
    color: '#aaa',
    lineHeight: '1.6',
    margin: 0
};

const listaStyle = {
    display: 'grid',
    gap: '18px'
};

const cardStyle = {
    backgroundColor: '#111',
    border: '1px solid #292929',
    borderRadius: '18px',
    padding: '22px'
};

const cabeceraDiaStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
};

const diaStyle = {
    color: '#fff',
    margin: '0 0 8px 0'
};

const estadoAbiertoStyle = {
    color: '#71d58b',
    fontSize: '13px',
    fontWeight: 'bold'
};

const estadoCerradoStyle = {
    color: '#ff7777',
    fontSize: '13px',
    fontWeight: 'bold'
};

const toggleLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#ddd',
    cursor: 'pointer',
    fontSize: '14px'
};

const checkboxStyle = {
    width: '18px',
    height: '18px',
    accentColor: '#d4af37',
    cursor: 'pointer'
};

const franjasStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px',
    marginTop: '20px'
};

const franjaStyle = {
    backgroundColor: '#0d0d0d',
    border: '1px solid #242424',
    borderRadius: '14px',
    padding: '18px'
};

const franjaTituloStyle = {
    color: '#d4af37',
    marginTop: 0,
    marginBottom: '15px'
};

const horasStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))',
    gap: '12px'
};

const campoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px'
};

const labelStyle = {
    color: '#999',
    fontSize: '12px'
};

const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: '1px solid #333',
    borderRadius: '9px',
    padding: '10px'
};

const accionesStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '18px'
};

const guardarButtonStyle = {
    backgroundColor: '#d4af37',
    color: '#000',
    border: 'none',
    borderRadius: '9px',
    padding: '10px 18px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const estadoCargaStyle = {
    backgroundColor: '#111',
    color: '#aaa',
    border: '1px solid #292929',
    borderRadius: '18px',
    padding: '25px'
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


export default ConfiguracionHorarios;
