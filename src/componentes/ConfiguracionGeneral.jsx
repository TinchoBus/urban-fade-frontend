import {
    useEffect,
    useState
} from 'react';

import api from '../services/api';


function ConfiguracionGeneral({ onVolver }) {

    const [configuracion, setConfiguracion] =
        useState({
            nombreNegocio: '',
            intervaloTurnos: 15,
            diasReservaAnticipada: 30,
            activo: true
        });

    const [configuracionGuardada, setConfiguracionGuardada] =
        useState(null);

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [mensaje, setMensaje] =
        useState('');

    const [error, setError] =
        useState('');


    useEffect(() => {

        obtenerConfiguracion();

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


    const obtenerConfiguracion = async () => {

        try {

            setCargando(true);
            setError('');

            const respuesta =
                await api.get(
                    '/configuracion'
                );

            const datosRecibidos = {
                nombreNegocio:
                    respuesta.data.nombreNegocio || '',
                intervaloTurnos:
                    respuesta.data.intervaloTurnos || 15,
                diasReservaAnticipada:
                    respuesta.data.diasReservaAnticipada || 30,
                activo:
                    Boolean(respuesta.data.activo)
            };

            setConfiguracion(datosRecibidos);
            setConfiguracionGuardada(datosRecibidos);

        } catch (error) {

            console.log(error);

            setError(
                '❌ No se pudo cargar la configuración general.'
            );

        } finally {

            setCargando(false);
        }
    };


    const actualizarCampo = (
        campo,
        valor
    ) => {

        setConfiguracion(
            (anterior) => ({
                ...anterior,
                [campo]: valor
            })
        );
    };


    const hayCambios =
        configuracionGuardada
            ? JSON.stringify(configuracion) !==
              JSON.stringify(configuracionGuardada)
            : false;


    const cancelarCambios = () => {

        if (!configuracionGuardada) {
            return;
        }

        setConfiguracion({
            ...configuracionGuardada
        });

        setMensaje(
            '↩️ Los cambios no guardados fueron descartados.'
        );

        setError('');
    };


    const volverAlPanel = () => {

        if (
            hayCambios &&
            !window.confirm(
                'Hay cambios sin guardar. ¿Querés salir y descartarlos?'
            )
        ) {
            return;
        }

        if (onVolver) {
            onVolver();
        }
    };


    const validarFormulario = () => {

        if (
            !configuracion.nombreNegocio
                .trim()
        ) {

            setError(
                '⚠️ Ingresá el nombre del negocio.'
            );

            return false;
        }

        const intervalo =
            Number(
                configuracion.intervaloTurnos
            );

        if (
            !Number.isInteger(intervalo) ||
            intervalo <= 0
        ) {

            setError(
                '⚠️ El intervalo entre turnos debe ser un número entero mayor a 0.'
            );

            return false;
        }

        const diasAnticipacion =
            Number(
                configuracion.diasReservaAnticipada
            );

        if (
            !Number.isInteger(
                diasAnticipacion
            ) ||
            diasAnticipacion <= 0
        ) {

            setError(
                '⚠️ Los días de anticipación deben ser un número entero mayor a 0.'
            );

            return false;
        }

        return true;
    };


    const guardarConfiguracion =
        async () => {

            setMensaje('');
            setError('');

            if (!validarFormulario()) {
                return;
            }

            const confirma =
                window.confirm(
                    '¿Confirmás que querés guardar estos cambios en la configuración del negocio?'
                );

            if (!confirma) {
                return;
            }

            try {

                setGuardando(true);

                const datos = {
                    nombreNegocio:
                        configuracion.nombreNegocio
                            .trim(),

                    intervaloTurnos:
                        Number(
                            configuracion.intervaloTurnos
                        ),

                    diasReservaAnticipada:
                        Number(
                            configuracion.diasReservaAnticipada
                        ),

                    activo:
                        Boolean(
                            configuracion.activo
                        )
                };

                const respuesta =
                    await api.put(
                        '/configuracion',
                        datos
                    );

                const configuracionActualizada = {
                    nombreNegocio:
                        respuesta.data.nombreNegocio ||
                        datos.nombreNegocio,

                    intervaloTurnos:
                        respuesta.data.intervaloTurnos ||
                        datos.intervaloTurnos,

                    diasReservaAnticipada:
                        respuesta.data.diasReservaAnticipada ||
                        datos.diasReservaAnticipada,

                    activo:
                        respuesta.data.activo !== undefined
                            ? Boolean(
                                respuesta.data.activo
                            )
                            : datos.activo
                };

                setConfiguracion(
                    configuracionActualizada
                );

                setConfiguracionGuardada(
                    configuracionActualizada
                );

                setMensaje(
                    '✅ Configuración general actualizada correctamente.'
                );

            } catch (error) {

                console.log(error);

                const mensajeBackend =
                    error.response?.data?.mensaje;

                setError(
                    mensajeBackend
                        ? `❌ ${mensajeBackend}`
                        : '❌ No se pudo actualizar la configuración general.'
                );

            } finally {

                setGuardando(false);
            }
        };


    if (cargando) {

        return (
            <div style={estadoCargaStyle}>
                Cargando configuración general...
            </div>
        );
    }


    return (

        <div style={contenedorStyle}>

            <div style={navegacionStyle}>

                <button
                    type="button"
                    onClick={volverAlPanel}
                    style={volverButtonStyle}
                >
                    ← Volver al panel
                </button>

            </div>

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

                <p style={etiquetaStyle}>
                    CONFIGURACIÓN GENERAL
                </p>

                <h2 style={tituloStyle}>
                    Datos del negocio
                </h2>

                <p style={descripcionStyle}>
                    Administrá los parámetros generales que utiliza
                    Urban Fade para ofrecer y validar los turnos.
                </p>

            </div>


            <div style={cardStyle}>

                <div style={gridStyle}>

                    <div style={campoCompletoStyle}>

                        <label style={labelStyle}>
                            Nombre del negocio
                        </label>

                        <input
                            type="text"
                            value={
                                configuracion.nombreNegocio
                            }
                            onChange={(e) =>
                                actualizarCampo(
                                    'nombreNegocio',
                                    e.target.value
                                )
                            }
                            placeholder="Urban Fade"
                            style={inputStyle}
                        />

                    </div>


                    <div style={campoStyle}>

                        <label style={labelStyle}>
                            Intervalo entre turnos
                        </label>

                        <div style={inputConUnidadStyle}>

                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={
                                    configuracion.intervaloTurnos
                                }
                                onChange={(e) =>
                                    actualizarCampo(
                                        'intervaloTurnos',
                                        e.target.value
                                    )
                                }
                                style={inputNumeroStyle}
                            />

                            <span style={unidadStyle}>
                                minutos
                            </span>

                        </div>

                        <p style={ayudaStyle}>
                            Define cada cuánto puede comenzar
                            un nuevo turno.
                        </p>

                    </div>


                    <div style={campoStyle}>

                        <label style={labelStyle}>
                            Anticipación máxima
                        </label>

                        <div style={inputConUnidadStyle}>

                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={
                                    configuracion
                                        .diasReservaAnticipada
                                }
                                onChange={(e) =>
                                    actualizarCampo(
                                        'diasReservaAnticipada',
                                        e.target.value
                                    )
                                }
                                style={inputNumeroStyle}
                            />

                            <span style={unidadStyle}>
                                días
                            </span>

                        </div>

                        <p style={ayudaStyle}>
                            Cantidad máxima de días hacia
                            adelante permitidos para reservar.
                        </p>

                    </div>

                </div>


                <div style={estadoNegocioStyle}>

                    <div>

                        <h3 style={estadoTituloStyle}>
                            Estado del negocio
                        </h3>

                        <p style={estadoTextoStyle}>
                            Si está inactivo, el sistema
                            bloqueará nuevas reservas.
                        </p>

                    </div>


                    <label style={toggleLabelStyle}>

                        <input
                            type="checkbox"
                            checked={
                                Boolean(
                                    configuracion.activo
                                )
                            }
                            onChange={(e) =>
                                actualizarCampo(
                                    'activo',
                                    e.target.checked
                                )
                            }
                            style={checkboxStyle}
                        />

                        <span
                            style={
                                configuracion.activo
                                    ? activoStyle
                                    : inactivoStyle
                            }
                        >
                            {
                                configuracion.activo
                                    ? 'Activo'
                                    : 'Inactivo'
                            }
                        </span>

                    </label>

                </div>


                <div style={accionesStyle}>

                    <button
                        type="button"
                        onClick={cancelarCambios}
                        disabled={
                            guardando ||
                            !hayCambios
                        }
                        style={
                            hayCambios
                                ? cancelarButtonStyle
                                : cancelarButtonDeshabilitadoStyle
                        }
                    >
                        Cancelar cambios
                    </button>

                    <button
                        type="button"
                        onClick={
                            guardarConfiguracion
                        }
                        disabled={guardando}
                        style={guardarButtonStyle}
                    >
                        {
                            guardando
                                ? 'Guardando...'
                                : 'Guardar configuración'
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}


const contenedorStyle = {
    marginBottom: '28px'
};

const navegacionStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '14px'
};

const volverButtonStyle = {
    backgroundColor: 'transparent',
    color: '#d4af37',
    border: '1px solid #d4af37',
    borderRadius: '9px',
    padding: '9px 14px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const encabezadoStyle = {
    backgroundColor: '#111',
    border: '1px solid #292929',
    borderRadius: '18px',
    padding: '25px',
    marginBottom: '18px'
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

const cardStyle = {
    backgroundColor: '#111',
    border: '1px solid #292929',
    borderRadius: '18px',
    padding: '22px'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns:
        'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '18px'
};

const campoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const campoCompletoStyle = {
    ...campoStyle,
    gridColumn: '1 / -1'
};

const labelStyle = {
    color: '#ddd',
    fontSize: '14px',
    fontWeight: 'bold'
};

const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: '1px solid #333',
    borderRadius: '9px',
    padding: '11px'
};

const inputConUnidadStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

const inputNumeroStyle = {
    ...inputStyle,
    maxWidth: '150px'
};

const unidadStyle = {
    color: '#999',
    fontSize: '14px'
};

const ayudaStyle = {
    color: '#777',
    fontSize: '12px',
    lineHeight: '1.5',
    margin: 0
};

const estadoNegocioStyle = {
    marginTop: '22px',
    padding: '18px',
    backgroundColor: '#0d0d0d',
    border: '1px solid #242424',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap'
};

const estadoTituloStyle = {
    color: '#fff',
    margin: '0 0 6px 0'
};

const estadoTextoStyle = {
    color: '#888',
    margin: 0,
    fontSize: '13px'
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

const activoStyle = {
    color: '#71d58b',
    fontWeight: 'bold'
};

const inactivoStyle = {
    color: '#ff7777',
    fontWeight: 'bold'
};

const accionesStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '22px'
};

const cancelarButtonStyle = {
    backgroundColor: 'transparent',
    color: '#ddd',
    border: '1px solid #555',
    borderRadius: '9px',
    padding: '11px 20px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const cancelarButtonDeshabilitadoStyle = {
    ...cancelarButtonStyle,
    opacity: 0.4,
    cursor: 'not-allowed'
};

const guardarButtonStyle = {
    backgroundColor: '#d4af37',
    color: '#000',
    border: 'none',
    borderRadius: '9px',
    padding: '11px 20px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const estadoCargaStyle = {
    backgroundColor: '#111',
    color: '#aaa',
    border: '1px solid #292929',
    borderRadius: '18px',
    padding: '25px',
    marginBottom: '28px'
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


export default ConfiguracionGeneral;

