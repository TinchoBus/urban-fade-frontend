import { useEffect, useMemo, useState } from 'react';
import { obtenerPeluqueros } from '../services/usuarioService';
import { crearTurno } from '../services/turnoService';
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
    const mes = String(fechaObjeto.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaObjeto.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
};

const crearFechaLocal = (fechaTexto) => {
    const [anio, mes, dia] = fechaTexto
        .split('-')
        .map(Number);

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
    const horas = Math.floor(
        minutosTotales / 60
    );

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
        minuto < fin;
        minuto += intervalo
    ) {
        horarios.push(
            convertirAHora(minuto)
        );
    }

    return horarios;
};

function ReservaTurnoModal({ abierto, onClose }) {
    const [servicio, setServicio] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [peluqueroId, setPeluqueroId] = useState('');

    const [peluqueros, setPeluqueros] = useState([]);
    const [configuracion, setConfiguracion] = useState(null);
    const [horariosAtencion, setHorariosAtencion] = useState([]);
    const [fechasEspeciales, setFechasEspeciales] = useState([]);

    const [cargandoPeluqueros, setCargandoPeluqueros] = useState(false);
    const [cargandoConfiguracion, setCargandoConfiguracion] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const [tipoMensaje, setTipoMensaje] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        if (!abierto) return;

        const cargarDatos = async () => {
            try {
                setCargandoPeluqueros(true);
                setCargandoConfiguracion(true);
                setTipoMensaje('');
                setMensaje('');

                const [
                    datosPeluqueros,
                    respuestaConfiguracion,
                    respuestaHorarios,
                    respuestaFechasEspeciales
                ] = await Promise.all([
                    obtenerPeluqueros(),
                    api.get('/configuracion'),
                    api.get('/configuracion/horarios'),
                    api.get('/fechas-especiales')
                ]);

                setPeluqueros(datosPeluqueros);
                setConfiguracion(respuestaConfiguracion.data);
                setHorariosAtencion(respuestaHorarios.data);
                setFechasEspeciales(
                    respuestaFechasEspeciales.data
                );

            } catch (error) {
                console.error(
                    'Error al cargar datos de reserva:',
                    error
                );

                setTipoMensaje('error');
                setMensaje(
                    '🔴 No se pudo cargar la configuración de reservas.'
                );

            } finally {
                setCargandoPeluqueros(false);
                setCargandoConfiguracion(false);
            }
        };

        cargarDatos();

    }, [abierto]);

    const fechaMinima = obtenerFechaLocal();

    const fechaMaxima = useMemo(() => {
        const fechaLimite = new Date();

        const diasAnticipacion = Number(
            configuracion?.diasReservaAnticipada
        ) || 30;

        fechaLimite.setDate(
            fechaLimite.getDate() + diasAnticipacion
        );

        return obtenerFechaLocal(fechaLimite);

    }, [configuracion]);

    const fechaEspecialDelDia = useMemo(() => {

        if (!fecha) {
            return null;
        }

        return fechasEspeciales.find(
            (fechaEspecial) =>
                fechaEspecial.fecha === fecha
        ) || null;

    }, [fecha, fechasEspeciales]);


    const horarioDelDia = useMemo(() => {

        // Una fecha especial siempre tiene prioridad
        // sobre el horario semanal.
        if (fechaEspecialDelDia) {
            return fechaEspecialDelDia;
        }

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

        return horariosAtencion.find(
            (horario) =>
                horario.diaSemana === nombreDia
        ) || null;

    }, [
        fecha,
        horariosAtencion,
        fechaEspecialDelDia
    ]);

    const horariosDisponibles = useMemo(() => {
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
                horarioDelDia.horaInicioManana,
                horarioDelDia.horaFinManana,
                intervalo
            );

        const horariosTarde =
            generarFranja(
                horarioDelDia.horaInicioTarde,
                horarioDelDia.horaFinTarde,
                intervalo
            );

        let horarios = [
            ...horariosManana,
            ...horariosTarde
        ];

        if (
            fecha === obtenerFechaLocal()
        ) {
            const ahora = new Date();

            const minutosActuales =
                ahora.getHours() * 60 +
                ahora.getMinutes();

            horarios = horarios.filter(
                (horario) =>
                    convertirAMinutos(horario) >
                    minutosActuales
            );
        }

        return horarios;

    }, [
        fecha,
        horarioDelDia,
        configuracion
    ]);

    useEffect(() => {
        setHora('');

        if (
            !fecha ||
            cargandoConfiguracion
        ) {
            return;
        }

        if (!horarioDelDia) {
            setTipoMensaje('error');
            setMensaje(
                '🔴 No hay una configuración de atención disponible para la fecha seleccionada.'
            );
            return;
        }

        if (!horarioDelDia.abierto) {

            setTipoMensaje('error');

            if (fechaEspecialDelDia) {

                setMensaje(
                    fechaEspecialDelDia.descripcion
                        ? `🔴 Urban Fade permanece cerrado en esta fecha. ${fechaEspecialDelDia.descripcion}`
                        : '🔴 Urban Fade permanece cerrado en esta fecha por configuración especial.'
                );

            } else {

                setMensaje(
                    `🔴 Urban Fade permanece cerrado los ${horarioDelDia.diaSemana}. Seleccioná otra fecha.`
                );
            }

            return;
        }

        if (
            horariosDisponibles.length === 0
        ) {
            setTipoMensaje('error');
            setMensaje(
                '🔴 No quedan horarios disponibles para la fecha seleccionada.'
            );
            return;
        }

        setTipoMensaje('');
        setMensaje('');

    }, [
        fecha,
        horarioDelDia,
        horariosDisponibles,
        cargandoConfiguracion,
        fechaEspecialDelDia
    ]);

    const limpiarFormulario = () => {
        setServicio('');
        setFecha('');
        setHora('');
        setPeluqueroId('');
        setTipoMensaje('');
        setMensaje('');
    };

    const cerrarModal = () => {
        if (guardando) return;

        limpiarFormulario();
        onClose();
    };

    const validarFechaYHora = () => {
        if (!fecha) {
            setTipoMensaje('error');
            setMensaje(
                '🔴 Debés seleccionar una fecha.'
            );
            return false;
        }

        if (!horarioDelDia) {
            setTipoMensaje('error');
            setMensaje(
                '🔴 No existe una configuración de atención para la fecha seleccionada.'
            );
            return false;
        }

        if (!horarioDelDia.abierto) {

            setTipoMensaje('error');

            if (fechaEspecialDelDia) {

                setMensaje(
                    fechaEspecialDelDia.descripcion
                        ? `🔴 Urban Fade permanece cerrado en esta fecha. ${fechaEspecialDelDia.descripcion}`
                        : '🔴 Urban Fade permanece cerrado en esta fecha por configuración especial.'
                );

            } else {

                setMensaje(
                    `🔴 Urban Fade permanece cerrado los ${horarioDelDia.diaSemana}. Seleccioná otra fecha.`
                );
            }

            return false;
        }

        if (!hora) {
            setTipoMensaje('error');
            setMensaje(
                '🔴 Debés seleccionar un horario.'
            );
            return false;
        }

        if (
            !horariosDisponibles.includes(hora)
        ) {
            setTipoMensaje('error');
            setMensaje(
                '🔴 El horario seleccionado no está disponible según la configuración del negocio.'
            );
            return false;
        }

        const fechaSeleccionada =
            crearFechaLocal(fecha);

        const hoy =
            crearFechaLocal(
                obtenerFechaLocal()
            );

        const limite =
            crearFechaLocal(fechaMaxima);

        if (
            fechaSeleccionada < hoy
        ) {
            setTipoMensaje('error');
            setMensaje(
                '🔴 Fecha incorrecta. La fecha seleccionada ya pasó.'
            );
            return false;
        }

        if (
            fechaSeleccionada > limite
        ) {
            setTipoMensaje('error');
            setMensaje(
                `🔴 Fecha fuera de rango. Solo podés reservar turnos dentro de los próximos ${configuracion?.diasReservaAnticipada || 30} días.`
            );
            return false;
        }

        return true;
    };

    const confirmarReserva = async (e) => {
        e.preventDefault();

        setTipoMensaje('');
        setMensaje('');

        if (
            !servicio ||
            !fecha ||
            !hora ||
            !peluqueroId
        ) {
            setTipoMensaje('error');
            setMensaje(
                '🔴 Completá todos los campos antes de confirmar la reserva.'
            );
            return;
        }

        if (!validarFechaYHora()) {
            return;
        }

        const confirmar = window.confirm(
            '¿Está seguro de que desea confirmar este turno?'
        );

        if (!confirmar) return;

        try {
            setGuardando(true);

            const datosTurno = {
                fecha,
                hora,
                servicio,
                peluqueroId:
                    Number(peluqueroId)
            };

            const respuesta =
                await crearTurno(datosTurno);

            console.log(
                'Respuesta del servidor:',
                respuesta
            );

            setTipoMensaje('exito');
            setMensaje(
                '🟢 Turno confirmado correctamente.'
            );

            setTimeout(() => {
                limpiarFormulario();
                onClose();
            }, 1200);

        } catch (error) {
            console.error(
                'Error al crear turno:',
                error
            );

            setTipoMensaje('error');

            if (
                error.response?.data?.mensaje
            ) {
                setMensaje(
                    `🔴 ${error.response.data.mensaje}`
                );
            } else {
                setMensaje(
                    '🔴 No se pudo guardar el turno. Verificá que el servidor esté funcionando.'
                );
            }

        } finally {
            setGuardando(false);
        }
    };

    if (!abierto) {
        return null;
    }

    const cargandoDatos =
        cargandoPeluqueros ||
        cargandoConfiguracion;

    return (
        <div style={overlayStyle}>

            <div style={modalStyle}>

                <h2 style={titleStyle}>
                    📅 Reservar Turno
                </h2>

                <p style={subtitleStyle}>
                    Elegí el servicio, fecha, horario y profesional.
                </p>

                {mensaje && (
                    <div
                        style={
                            tipoMensaje === 'exito'
                                ? successStyle
                                : errorStyle
                        }
                    >
                        {mensaje}
                    </div>
                )}

                <form onSubmit={confirmarReserva}>

                    <label style={labelStyle}>
                        Servicio
                    </label>

                    <select
                        value={servicio}
                        onChange={(e) =>
                            setServicio(
                                e.target.value
                            )
                        }
                        style={inputStyle}
                        disabled={
                            guardando ||
                            cargandoDatos
                        }
                    >
                        <option value="">
                            Seleccioná un servicio
                        </option>

                        <option value="Corte Clásico">
                            Corte Clásico
                        </option>

                        <option value="Fade">
                            Fade
                        </option>

                        <option value="Corte + Barba">
                            Corte + Barba
                        </option>

                        <option value="Corte Infantil">
                            Corte Infantil
                        </option>
                    </select>

                    <label style={labelStyle}>
                        Fecha
                    </label>

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
                            setTipoMensaje('');
                            setMensaje('');
                        }}
                        style={inputStyle}
                        disabled={
                            guardando ||
                            cargandoConfiguracion
                        }
                    />

                    <label style={labelStyle}>
                        Hora
                    </label>

                    <select
                        value={hora}
                        onChange={(e) => {
                            setHora(
                                e.target.value
                            );
                            setTipoMensaje('');
                            setMensaje('');
                        }}
                        style={inputStyle}
                        disabled={
                            guardando ||
                            cargandoConfiguracion ||
                            !fecha ||
                            !horarioDelDia?.abierto ||
                            horariosDisponibles.length === 0
                        }
                    >
                        <option value="">
                            {!fecha
                                ? 'Primero seleccioná una fecha'
                                : !horarioDelDia
                                    ? 'Horario no configurado'
                                    : !horarioDelDia.abierto
                                        ? 'Negocio cerrado'
                                        : horariosDisponibles.length === 0
                                            ? 'Sin horarios disponibles'
                                            : 'Seleccioná un horario'}
                        </option>

                        {horariosDisponibles.map(
                            (horario) => (
                                <option
                                    key={horario}
                                    value={horario}
                                >
                                    {horario}
                                </option>
                            )
                        )}
                    </select>

                    {fecha &&
                        horarioDelDia?.abierto &&
                        horariosDisponibles.length > 0 && (

                            <div style={infoHorarioStyle}>

                                Horario de atención:{' '}
                                {horarioDelDia.horaInicioManana?.slice(0, 5)}
                                {' - '}
                                {horarioDelDia.horaFinManana?.slice(0, 5)}

                                {' / '}

                                {horarioDelDia.horaInicioTarde?.slice(0, 5)}
                                {' - '}
                                {horarioDelDia.horaFinTarde?.slice(0, 5)}

                                <br />

                                Intervalos de{' '}
                                {configuracion?.intervaloTurnos || 15}{' '}
                                minutos.

                            </div>

                        )}

                    <label style={labelStyle}>
                        Peluquero
                    </label>

                    <select
                        value={peluqueroId}
                        onChange={(e) =>
                            setPeluqueroId(
                                e.target.value
                            )
                        }
                        style={inputStyle}
                        disabled={
                            guardando ||
                            cargandoPeluqueros
                        }
                    >
                        <option value="">
                            {cargandoPeluqueros
                                ? 'Cargando peluqueros...'
                                : 'Seleccioná un peluquero'}
                        </option>

                        {peluqueros.map(
                            (peluquero) => (
                                <option
                                    key={peluquero.id}
                                    value={peluquero.id}
                                >
                                    {peluquero.nombre}{' '}
                                    {peluquero.apellido}
                                </option>
                            )
                        )}
                    </select>

                    <button
                        type="submit"
                        style={
                            guardando ||
                            cargandoDatos
                                ? disabledButtonStyle
                                : buttonStyle
                        }
                        disabled={
                            guardando ||
                            cargandoDatos
                        }
                    >
                        {guardando
                            ? 'Guardando...'
                            : cargandoDatos
                                ? 'Cargando configuración...'
                                : 'Confirmar Reserva'}
                    </button>

                    <button
                        type="button"
                        style={closeButton}
                        onClick={cerrarModal}
                        disabled={guardando}
                    >
                        Cancelar
                    </button>

                </form>

            </div>

        </div>
    );
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    zIndex: 9999
};

const modalStyle = {
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: '#111',
    border: '1px solid #d4af37',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 0 40px rgba(212, 175, 55, 0.18)'
};

const titleStyle = {
    color: '#d4af37',
    marginTop: 0,
    marginBottom: '8px',
    fontSize: '26px'
};

const subtitleStyle = {
    color: '#aaa',
    marginTop: 0,
    marginBottom: '25px',
    fontSize: '14px'
};

const labelStyle = {
    display: 'block',
    color: '#d4af37',
    marginBottom: '7px',
    fontWeight: 'bold',
    fontSize: '14px'
};

const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px',
    marginBottom: '18px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '10px',
    color: '#fff',
    outline: 'none',
    fontSize: '15px'
};

const infoHorarioStyle = {
    marginTop: '-8px',
    marginBottom: '18px',
    padding: '10px 12px',
    backgroundColor: '#171717',
    border: '1px solid #333',
    borderRadius: '10px',
    color: '#aaa',
    fontSize: '12px',
    lineHeight: '1.6'
};

const buttonStyle = {
    width: '100%',
    padding: '14px',
    marginTop: '5px',
    backgroundColor: '#d4af37',
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
};

const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6d5b1c',
    color: '#777',
    cursor: 'not-allowed'
};

const closeButton = {
    width: '100%',
    padding: '14px',
    marginTop: '10px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '15px'
};

const errorStyle = {
    backgroundColor: '#351515',
    border: '1px solid #ff3333',
    color: '#ff6b6b',
    borderRadius: '10px',
    padding: '13px 15px',
    marginBottom: '18px',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 0 12px rgba(255, 51, 51, 0.15)'
};

const successStyle = {
    backgroundColor: '#12351f',
    border: '1px solid #2ecc71',
    color: '#5dff9a',
    borderRadius: '10px',
    padding: '13px 15px',
    marginBottom: '18px',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 0 12px rgba(46, 204, 113, 0.15)'
};

export default ReservaTurnoModal;

