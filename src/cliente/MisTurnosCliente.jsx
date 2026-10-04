import { useEffect, useState } from 'react';

import {
    obtenerMisTurnos
} from '../services/turnoService';

function MisTurnosCliente() {

    const [turnos, setTurnos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarTurnos();
    }, []);

    const cargarTurnos = async () => {

        try {
            setCargando(true);
            setError('');

            const datos = await obtenerMisTurnos();
            setTurnos(datos);

        } catch (error) {

            console.error(
                'Error al obtener mis turnos:',
                error
            );

            setError(
                'No se pudieron cargar tus turnos.'
            );

        } finally {
            setCargando(false);
        }
    };

    const formatearFecha = (fecha) => {

        if (!fecha) return '-';

        const partes = fecha.split('-');

        if (partes.length !== 3) {
            return fecha;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    };

    const obtenerColorEstado = (estado) => {

        if (estado === 'confirmado') {
            return '#00c853';
        }

        if (estado === 'finalizado') {
            return '#00ff88';
        }

        if (estado === 'cancelado') {
            return '#ff4d4d';
        }

        return '#d4af37';
    };

    if (cargando) {

        return (
            <div style={contenedorStyle}>
                <h2 style={tituloStyle}>
                    📅 Mis Turnos
                </h2>

                <p style={textoStyle}>
                    Cargando tus turnos...
                </p>
            </div>
        );
    }

    return (

        <div style={contenedorStyle}>

            <div style={cabeceraStyle}>

                <div>
                    <h2 style={tituloStyle}>
                        📅 Mis Turnos
                    </h2>

                    <p style={subtituloStyle}>
                        Acá podés consultar todas tus reservas.
                    </p>
                </div>

                <button
                    style={actualizarButton}
                    onClick={cargarTurnos}
                >
                    Actualizar
                </button>

            </div>

            {
                error && (
                    <div style={errorStyle}>
                        🔴 {error}
                    </div>
                )
            }

            {
                !error &&
                turnos.length === 0 && (

                    <div style={sinTurnosStyle}>

                        <div style={iconoStyle}>
                            📭
                        </div>

                        <h3 style={sinTurnosTitulo}>
                            Todavía no tenés turnos reservados
                        </h3>

                        <p style={textoStyle}>
                            Cuando reserves un turno aparecerá acá.
                        </p>

                    </div>

                )
            }

            {
                turnos.length > 0 && (

                    <div style={tablaContenedorStyle}>

                        <table style={tablaStyle}>

                            <thead>
                                <tr style={theadStyle}>
                                    <th style={thStyle}>Fecha</th>
                                    <th style={thStyle}>Hora</th>
                                    <th style={thStyle}>Servicio</th>
                                    <th style={thStyle}>Peluquero</th>
                                    <th style={thStyle}>Estado</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    turnos.map((turno) => (

                                        <tr
                                            key={turno.id}
                                            style={filaStyle}
                                        >

                                            <td style={tdStyle}>
                                                {
                                                    formatearFecha(
                                                        turno.fecha
                                                    )
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    turno.hora || '-'
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    turno.servicio || '-'
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    turno.peluquero
                                                        ? `${turno.peluquero.nombre} ${turno.peluquero.apellido}`
                                                        : 'Sin asignar'
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                <span
                                                    style={{
                                                        ...estadoStyle,
                                                        color:
                                                            obtenerColorEstado(
                                                                turno.estado
                                                            ),
                                                        borderColor:
                                                            obtenerColorEstado(
                                                                turno.estado
                                                            )
                                                    }}
                                                >
                                                    {
                                                        turno.estado ||
                                                        'pendiente'
                                                    }
                                                </span>
                                            </td>

                                        </tr>

                                    ))
                                }

                            </tbody>

                        </table>

                    </div>

                )
            }

        </div>
    );
}

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
    marginBottom: '25px'
};

const tituloStyle = {
    color: '#d4af37',
    margin: 0
};

const subtituloStyle = {
    color: '#aaa',
    marginTop: '8px',
    marginBottom: 0
};

const textoStyle = {
    color: '#aaa'
};

const actualizarButton = {
    backgroundColor: '#d4af37',
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 18px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const errorStyle = {
    backgroundColor: '#351515',
    border: '1px solid #ff3333',
    color: '#ff6b6b',
    padding: '14px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontWeight: 'bold'
};

const sinTurnosStyle = {
    textAlign: 'center',
    padding: '40px 20px',
    border: '1px solid #222',
    borderRadius: '15px',
    backgroundColor: '#0d0d0d'
};

const iconoStyle = {
    fontSize: '40px',
    marginBottom: '10px'
};

const sinTurnosTitulo = {
    color: '#fff',
    marginBottom: '8px'
};

const tablaContenedorStyle = {
    overflowX: 'auto'
};

const tablaStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const theadStyle = {
    borderBottom: '1px solid #d4af37'
};

const thStyle = {
    color: '#d4af37',
    textAlign: 'left',
    padding: '14px 12px',
    fontSize: '13px',
    letterSpacing: '0.5px'
};

const filaStyle = {
    borderBottom: '1px solid #222'
};

const tdStyle = {
    color: '#ddd',
    padding: '16px 12px',
    fontSize: '14px'
};

const estadoStyle = {
    display: 'inline-block',
    padding: '6px 10px',
    border: '1px solid',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'capitalize'
};

export default MisTurnosCliente;