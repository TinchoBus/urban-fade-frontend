import {
    useEffect,
    useRef,
    useState
} from 'react';

import api from '../services/api';


const formularioInicial = {
    fecha: '',
    descripcion: '',
    abierto: false,
    horaInicioManana: '',
    horaFinManana: '',
    horaInicioTarde: '',
    horaFinTarde: ''
};


function ConfiguracionFechasEspeciales() {

    const formularioRef =
        useRef(null);

    const [fechasEspeciales, setFechasEspeciales] =
        useState([]);

    const [formulario, setFormulario] =
        useState(formularioInicial);

    const [editandoId, setEditandoId] =
        useState(null);

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [eliminandoId, setEliminandoId] =
        useState(null);

    const [mensaje, setMensaje] =
        useState('');

    const [error, setError] =
        useState('');

    const [trabajaManana, setTrabajaManana] =
        useState(false);

    const [trabajaTarde, setTrabajaTarde] =
        useState(false);


    useEffect(() => {

        obtenerFechasEspeciales();

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


    const obtenerFechasEspeciales = async () => {

        try {

            setCargando(true);
            setError('');

            const respuesta =
                await api.get(
                    '/fechas-especiales'
                );

            setFechasEspeciales(
                respuesta.data
            );

        } catch (error) {

            console.log(error);

            setError(
                '❌ No se pudieron cargar las fechas especiales.'
            );

        } finally {

            setCargando(false);

        }
    };


    const actualizarCampo = (
        campo,
        valor
    ) => {

        if (
            campo === 'abierto' &&
            valor === false
        ) {

            setTrabajaManana(false);
            setTrabajaTarde(false);

            setFormulario((anterior) => ({
                ...anterior,
                abierto: false,
                horaInicioManana: '',
                horaFinManana: '',
                horaInicioTarde: '',
                horaFinTarde: ''
            }));

            return;
        }

        setFormulario((anterior) => ({
            ...anterior,
            [campo]: valor
        }));
    };


    const validarFranja = (
        inicio,
        fin,
        nombreFranja
    ) => {

        const tieneInicio =
            Boolean(inicio);

        const tieneFin =
            Boolean(fin);

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


    const validarFormulario = () => {

        if (!formulario.fecha) {

            setError(
                '⚠️ Seleccioná una fecha.'
            );

            return false;
        }

        if (!formulario.abierto) {
            return true;
        }

        if (!trabajaManana && !trabajaTarde) {
            setError(
                '⚠️ Si Urban Fade abre esta fecha, seleccioná mañana o tarde.'
            );
            return false;
        }

        if (trabajaManana) {
            const mananaValida =
                validarFranja(
                    formulario.horaInicioManana,
                    formulario.horaFinManana,
                    'mañana'
                );

            if (!mananaValida) {
                return false;
            }
        }

        if (trabajaTarde) {
            const tardeValida =
                validarFranja(
                    formulario.horaInicioTarde,
                    formulario.horaFinTarde,
                    'tarde'
                );

            if (!tardeValida) {
                return false;
            }
        }

        const tieneManana =
            trabajaManana &&
            formulario.horaInicioManana &&
            formulario.horaFinManana;

        const tieneTarde =
            trabajaTarde &&
            formulario.horaInicioTarde &&
            formulario.horaFinTarde;

        if (!tieneManana && !tieneTarde) {

            setError(
                '⚠️ Una fecha especial abierta debe tener al menos una franja horaria completa.'
            );

            return false;
        }

        return true;
    };


    const construirDatos = () => {

        if (!formulario.abierto) {

            return {
                fecha:
                    formulario.fecha,

                descripcion:
                    formulario.descripcion.trim(),

                abierto: false
            };
        }

        return {
            fecha:
                formulario.fecha,

            descripcion:
                formulario.descripcion.trim(),

            abierto: true,

            horaInicioManana:
                trabajaManana
                    ? formulario.horaInicioManana || null
                    : null,

            horaFinManana:
                trabajaManana
                    ? formulario.horaFinManana || null
                    : null,

            horaInicioTarde:
                trabajaTarde
                    ? formulario.horaInicioTarde || null
                    : null,

            horaFinTarde:
                trabajaTarde
                    ? formulario.horaFinTarde || null
                    : null
        };
    };


    const limpiarFormulario = () => {

        setFormulario(
            formularioInicial
        );

        setTrabajaManana(false);
        setTrabajaTarde(false);
        setEditandoId(null);
    };


    const guardarFechaEspecial =
        async (e) => {

            e.preventDefault();

            setMensaje('');
            setError('');

            if (!validarFormulario()) {
                return;
            }

            try {

                setGuardando(true);

                const datos =
                    construirDatos();

                if (editandoId) {

                    await api.put(
                        `/fechas-especiales/${editandoId}`,
                        datos
                    );

                    setMensaje(
                        '✅ Fecha especial actualizada correctamente.'
                    );

                } else {

                    await api.post(
                        '/fechas-especiales',
                        datos
                    );

                    setMensaje(
                        '✅ Fecha especial creada correctamente.'
                    );
                }

                limpiarFormulario();

                await obtenerFechasEspeciales();

            } catch (error) {

                console.log(error);

                const mensajeBackend =
                    error.response?.data?.mensaje;

                setError(
                    mensajeBackend
                        ? `❌ ${mensajeBackend}`
                        : '❌ No se pudo guardar la fecha especial.'
                );

            } finally {

                setGuardando(false);

            }
        };


    const editarFecha = (
        fechaEspecial
    ) => {

        setMensaje('');
        setError('');

        setEditandoId(
            fechaEspecial.id
        );

        setTrabajaManana(
            Boolean(
                fechaEspecial.horaInicioManana &&
                fechaEspecial.horaFinManana
            )
        );

        setTrabajaTarde(
            Boolean(
                fechaEspecial.horaInicioTarde &&
                fechaEspecial.horaFinTarde
            )
        );

        setFormulario({
            fecha:
                fechaEspecial.fecha || '',

            descripcion:
                fechaEspecial.descripcion || '',

            abierto:
                Boolean(
                    fechaEspecial.abierto
                ),

            horaInicioManana:
                fechaEspecial.horaInicioManana
                    ? fechaEspecial.horaInicioManana.slice(
                        0,
                        5
                    )
                    : '',

            horaFinManana:
                fechaEspecial.horaFinManana
                    ? fechaEspecial.horaFinManana.slice(
                        0,
                        5
                    )
                    : '',

            horaInicioTarde:
                fechaEspecial.horaInicioTarde
                    ? fechaEspecial.horaInicioTarde.slice(
                        0,
                        5
                    )
                    : '',

            horaFinTarde:
                fechaEspecial.horaFinTarde
                    ? fechaEspecial.horaFinTarde.slice(
                        0,
                        5
                    )
                    : ''
        });

        setTimeout(() => {

            formularioRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        }, 0);
    };


    const eliminarFecha =
        async (fechaEspecial) => {

            const confirmar =
                window.confirm(
                    `¿Eliminar la configuración especial del ${formatearFecha(fechaEspecial.fecha)}?`
                );

            if (!confirmar) {
                return;
            }

            try {

                setMensaje('');
                setError('');

                setEliminandoId(
                    fechaEspecial.id
                );

                await api.delete(
                    `/fechas-especiales/${fechaEspecial.id}`
                );

                if (
                    editandoId ===
                    fechaEspecial.id
                ) {

                    limpiarFormulario();
                }

                setMensaje(
                    '✅ Fecha especial eliminada correctamente.'
                );

                await obtenerFechasEspeciales();

            } catch (error) {

                console.log(error);

                const mensajeBackend =
                    error.response?.data?.mensaje;

                setError(
                    mensajeBackend
                        ? `❌ ${mensajeBackend}`
                        : '❌ No se pudo eliminar la fecha especial.'
                );

            } finally {

                setEliminandoId(null);

            }
        };


    const formatearFecha = (fecha) => {

        if (!fecha) {
            return '';
        }

        const [
            anio,
            mes,
            dia
        ] = fecha.split('-');

        return `${dia}/${mes}/${anio}`;
    };


    const obtenerResumenHorario = (
        fechaEspecial
    ) => {

        if (!fechaEspecial.abierto) {

            return 'Urban Fade permanecerá cerrado.';
        }

        const franjas = [];

        if (
            fechaEspecial.horaInicioManana &&
            fechaEspecial.horaFinManana
        ) {

            franjas.push(
                `Mañana ${fechaEspecial.horaInicioManana.slice(0, 5)} - ${fechaEspecial.horaFinManana.slice(0, 5)}`
            );
        }

        if (
            fechaEspecial.horaInicioTarde &&
            fechaEspecial.horaFinTarde
        ) {

            franjas.push(
                `Tarde ${fechaEspecial.horaInicioTarde.slice(0, 5)} - ${fechaEspecial.horaFinTarde.slice(0, 5)}`
            );
        }

        return franjas.join(' · ');
    };


    const obtenerFechaMinima = () => {

        const hoy =
            new Date();

        const anio =
            hoy.getFullYear();

        const mes =
            String(
                hoy.getMonth() + 1
            ).padStart(2, '0');

        const dia =
            String(
                hoy.getDate()
            ).padStart(2, '0');

        return `${anio}-${mes}-${dia}`;
    };


    return (

        <div style={contenedorStyle}>

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
                    CONFIGURACIÓN DEL NEGOCIO
                </p>

                <h2 style={tituloStyle}>
                    Fechas especiales
                </h2>

                <p style={descripcionStyle}>
                    Configurá feriados, vacaciones, cierres
                    extraordinarios o aperturas excepcionales.
                    Una fecha especial tiene prioridad sobre
                    el horario semanal.
                </p>

            </div>


            <form
                ref={formularioRef}
                onSubmit={
                    guardarFechaEspecial
                }
                style={formularioStyle}
            >

                <div style={cabeceraFormularioStyle}>

                    <div>

                        <h3 style={subtituloStyle}>
                            {
                                editandoId
                                    ? 'Editar fecha especial'
                                    : 'Nueva fecha especial'
                            }
                        </h3>

                        <p style={textoSecundarioStyle}>
                            {
                                editandoId
                                    ? 'Modificá los datos y guardá los cambios.'
                                    : 'Agregá una excepción al horario semanal.'
                            }
                        </p>

                    </div>

                    {
                        editandoId && (
                            <button
                                type="button"
                                onClick={
                                    limpiarFormulario
                                }
                                style={cancelarButtonStyle}
                            >
                                Cancelar edición
                            </button>
                        )
                    }

                </div>


                <div style={gridFormularioStyle}>

                    <div style={campoStyle}>

                        <label style={labelStyle}>
                            Fecha
                        </label>

                        <input
                            type="date"
                            value={
                                formulario.fecha
                            }
                            min={
                                editandoId
                                    ? undefined
                                    : obtenerFechaMinima()
                            }
                            onChange={(e) =>
                                actualizarCampo(
                                    'fecha',
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        />

                    </div>


                    <div style={campoStyle}>

                        <label style={labelStyle}>
                            Descripción
                        </label>

                        <input
                            type="text"
                            value={
                                formulario.descripcion
                            }
                            maxLength={150}
                            placeholder="Ej: Feriado, vacaciones, evento especial..."
                            onChange={(e) =>
                                actualizarCampo(
                                    'descripcion',
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        />

                    </div>

                </div>


                <div style={estadoBoxStyle}>

                    <div>

                        <strong style={estadoTituloStyle}>
                            Estado del negocio
                        </strong>

                        <p style={textoSecundarioStyle}>
                            Marcá la opción si Urban Fade
                            atenderá durante esta fecha.
                        </p>

                    </div>

                    <label style={toggleLabelStyle}>

                        <input
                            type="checkbox"
                            checked={
                                formulario.abierto
                            }
                            onChange={(e) =>
                                actualizarCampo(
                                    'abierto',
                                    e.target.checked
                                )
                            }
                            style={checkboxStyle}
                        />

                        <span>
                            {
                                formulario.abierto
                                    ? 'Abierto'
                                    : 'Cerrado'
                            }
                        </span>

                    </label>

                </div>


                {
                    formulario.abierto && (

                        <div style={franjasStyle}>

                            <div style={franjaStyle}>

                                <div style={cabeceraFranjaStyle}>
                                    <div>
                                        <h4 style={franjaTituloStyle}>
                                            Turno mañana
                                        </h4>
                                        <span style={
                                            trabajaManana
                                                ? estadoAbiertoStyle
                                                : estadoCerradoStyle
                                        }>
                                            {trabajaManana ? 'Trabaja' : 'Cerrado'}
                                        </span>
                                    </div>

                                    <label style={toggleLabelStyle}>
                                        <input
                                            type="checkbox"
                                            checked={trabajaManana}
                                            onChange={(e) => {
                                                const activo = e.target.checked;
                                                setTrabajaManana(activo);

                                                if (!activo) {
                                                    setFormulario((anterior) => ({
                                                        ...anterior,
                                                        horaInicioManana: '',
                                                        horaFinManana: ''
                                                    }));
                                                }
                                            }}
                                            style={checkboxStyle}
                                        />
                                        <span>Atender por la mañana</span>
                                    </label>
                                </div>

                                {trabajaManana && (
                                    <div style={horasStyle}>
                                        <div style={campoStyle}>
                                            <label style={labelStyle}>Desde</label>
                                            <input
                                                type="time"
                                                value={formulario.horaInicioManana}
                                                onChange={(e) =>
                                                    actualizarCampo(
                                                        'horaInicioManana',
                                                        e.target.value
                                                    )
                                                }
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div style={campoStyle}>
                                            <label style={labelStyle}>Hasta</label>
                                            <input
                                                type="time"
                                                value={formulario.horaFinManana}
                                                onChange={(e) =>
                                                    actualizarCampo(
                                                        'horaFinManana',
                                                        e.target.value
                                                    )
                                                }
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>


                            <div style={franjaStyle}>

                                <div style={cabeceraFranjaStyle}>
                                    <div>
                                        <h4 style={franjaTituloStyle}>
                                            Turno tarde
                                        </h4>
                                        <span style={
                                            trabajaTarde
                                                ? estadoAbiertoStyle
                                                : estadoCerradoStyle
                                        }>
                                            {trabajaTarde ? 'Trabaja' : 'Cerrado'}
                                        </span>
                                    </div>

                                    <label style={toggleLabelStyle}>
                                        <input
                                            type="checkbox"
                                            checked={trabajaTarde}
                                            onChange={(e) => {
                                                const activo = e.target.checked;
                                                setTrabajaTarde(activo);

                                                if (!activo) {
                                                    setFormulario((anterior) => ({
                                                        ...anterior,
                                                        horaInicioTarde: '',
                                                        horaFinTarde: ''
                                                    }));
                                                }
                                            }}
                                            style={checkboxStyle}
                                        />
                                        <span>Atender por la tarde</span>
                                    </label>
                                </div>

                                {trabajaTarde && (
                                    <div style={horasStyle}>
                                        <div style={campoStyle}>
                                            <label style={labelStyle}>Desde</label>
                                            <input
                                                type="time"
                                                value={formulario.horaInicioTarde}
                                                onChange={(e) =>
                                                    actualizarCampo(
                                                        'horaInicioTarde',
                                                        e.target.value
                                                    )
                                                }
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div style={campoStyle}>
                                            <label style={labelStyle}>Hasta</label>
                                            <input
                                                type="time"
                                                value={formulario.horaFinTarde}
                                                onChange={(e) =>
                                                    actualizarCampo(
                                                        'horaFinTarde',
                                                        e.target.value
                                                    )
                                                }
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>

                        </div>
                    )
                }


                <div style={accionesFormularioStyle}>

                    <button
                        type="submit"
                        disabled={guardando}
                        style={guardarButtonStyle}
                    >
                        {
                            guardando
                                ? 'Guardando...'
                                : editandoId
                                    ? 'Guardar cambios'
                                    : 'Agregar fecha especial'
                        }
                    </button>

                </div>

            </form>


            <div style={listaContenedorStyle}>

                <div style={cabeceraListaStyle}>

                    <div>

                        <h3 style={subtituloStyle}>
                            Fechas configuradas
                        </h3>

                        <p style={textoSecundarioStyle}>
                            Estas excepciones reemplazan
                            el horario semanal únicamente
                            para la fecha indicada.
                        </p>

                    </div>

                    <span style={contadorStyle}>
                        {fechasEspeciales.length}
                    </span>

                </div>


                {
                    cargando ? (

                        <div style={estadoCargaStyle}>
                            Cargando fechas especiales...
                        </div>

                    ) : fechasEspeciales.length === 0 ? (

                        <div style={vacioStyle}>
                            No hay fechas especiales configuradas.
                        </div>

                    ) : (

                        <div style={listaStyle}>

                            {
                                fechasEspeciales.map(
                                    (fechaEspecial) => (

                                        <div
                                            key={
                                                fechaEspecial.id
                                            }
                                            style={cardStyle}
                                        >

                                            <div style={cardContenidoStyle}>

                                                <div>

                                                    <div style={fechaCabeceraStyle}>

                                                        <h4 style={fechaStyle}>
                                                            {formatearFecha(fechaEspecial.fecha)}
                                                        </h4>

                                                        <span
                                                            style={
                                                                fechaEspecial.abierto
                                                                    ? estadoAbiertoStyle
                                                                    : estadoCerradoStyle
                                                            }
                                                        >
                                                            {
                                                                fechaEspecial.abierto
                                                                    ? 'Abierto'
                                                                    : 'Cerrado'
                                                            }
                                                        </span>

                                                    </div>

                                                    <p style={descripcionFechaStyle}>
                                                        {
                                                            fechaEspecial.descripcion ||
                                                            'Sin descripción'
                                                        }
                                                    </p>

                                                    <p style={horarioResumenStyle}>
                                                        {obtenerResumenHorario(fechaEspecial)}
                                                    </p>

                                                </div>


                                                <div style={accionesCardStyle}>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            editarFecha(
                                                                fechaEspecial
                                                            )
                                                        }
                                                        style={editarButtonStyle}
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            eliminandoId ===
                                                            fechaEspecial.id
                                                        }
                                                        onClick={() =>
                                                            eliminarFecha(
                                                                fechaEspecial
                                                            )
                                                        }
                                                        style={eliminarButtonStyle}
                                                    >
                                                        {
                                                            eliminandoId ===
                                                            fechaEspecial.id
                                                                ? 'Eliminando...'
                                                                : 'Eliminar'
                                                        }
                                                    </button>

                                                </div>

                                            </div>

                                        </div>
                                    )
                                )
                            }

                        </div>
                    )
                }

            </div>

        </div>
    );
}


const contenedorStyle = {
    marginTop: '30px'
};

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

const formularioStyle = {
    backgroundColor: '#111',
    border: '1px solid #292929',
    borderRadius: '18px',
    padding: '25px',
    marginBottom: '22px'
};

const cabeceraFormularioStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '22px'
};

const subtituloStyle = {
    color: '#fff',
    margin: '0 0 8px 0'
};

const textoSecundarioStyle = {
    color: '#999',
    margin: 0,
    lineHeight: '1.5',
    fontSize: '14px'
};

const gridFormularioStyle = {
    display: 'grid',
    gridTemplateColumns:
        'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px'
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

const estadoBoxStyle = {
    backgroundColor: '#0d0d0d',
    border: '1px solid #242424',
    borderRadius: '14px',
    padding: '18px',
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
};

const estadoTituloStyle = {
    color: '#d4af37'
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
    gridTemplateColumns:
        'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px',
    marginTop: '20px'
};

const franjaStyle = {
    backgroundColor: '#0d0d0d',
    border: '1px solid #242424',
    borderRadius: '14px',
    padding: '18px'
};

const cabeceraFranjaStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '15px'
};

const franjaTituloStyle = {
    color: '#d4af37',
    marginTop: 0,
    marginBottom: '8px'
};

const horasStyle = {
    display: 'grid',
    gridTemplateColumns:
        'repeat(2, minmax(110px, 1fr))',
    gap: '12px'
};

const accionesFormularioStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '22px'
};

const guardarButtonStyle = {
    backgroundColor: '#d4af37',
    color: '#000',
    border: 'none',
    borderRadius: '9px',
    padding: '11px 18px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const cancelarButtonStyle = {
    backgroundColor: 'transparent',
    color: '#ccc',
    border: '1px solid #555',
    borderRadius: '9px',
    padding: '9px 14px',
    cursor: 'pointer'
};

const listaContenedorStyle = {
    backgroundColor: '#111',
    border: '1px solid #292929',
    borderRadius: '18px',
    padding: '25px'
};

const cabeceraListaStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '20px'
};

const contadorStyle = {
    minWidth: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#d4af37',
    color: '#000',
    fontWeight: 'bold'
};

const listaStyle = {
    display: 'grid',
    gap: '14px'
};

const cardStyle = {
    backgroundColor: '#0d0d0d',
    border: '1px solid #242424',
    borderRadius: '14px',
    padding: '18px'
};

const cardContenidoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
};

const fechaCabeceraStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
};

const fechaStyle = {
    color: '#fff',
    margin: 0,
    fontSize: '18px'
};

const descripcionFechaStyle = {
    color: '#ccc',
    margin: '8px 0 5px 0'
};

const horarioResumenStyle = {
    color: '#888',
    margin: 0,
    fontSize: '13px'
};

const estadoAbiertoStyle = {
    color: '#71d58b',
    border: '1px solid rgba(113,213,139,0.35)',
    borderRadius: '999px',
    padding: '4px 9px',
    fontSize: '12px',
    fontWeight: 'bold'
};

const estadoCerradoStyle = {
    color: '#ff7777',
    border: '1px solid rgba(255,119,119,0.35)',
    borderRadius: '999px',
    padding: '4px 9px',
    fontSize: '12px',
    fontWeight: 'bold'
};

const accionesCardStyle = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
};

const editarButtonStyle = {
    backgroundColor: '#d4af37',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 14px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const eliminarButtonStyle = {
    backgroundColor: '#a61d24',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 14px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const estadoCargaStyle = {
    backgroundColor: '#0d0d0d',
    color: '#aaa',
    border: '1px solid #292929',
    borderRadius: '14px',
    padding: '20px'
};

const vacioStyle = {
    color: '#888',
    backgroundColor: '#0d0d0d',
    border: '1px dashed #333',
    borderRadius: '14px',
    padding: '24px',
    textAlign: 'center'
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


export default ConfiguracionFechasEspeciales;
