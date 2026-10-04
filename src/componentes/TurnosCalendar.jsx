import FullCalendar from '@fullcalendar/react';

import dayGridPlugin from '@fullcalendar/daygrid';

import timeGridPlugin from '@fullcalendar/timegrid';

import interactionPlugin from '@fullcalendar/interaction';

import esLocale from '@fullcalendar/core/locales/es';

import {
    useEffect,
    useState
} from 'react';

import api from '../services/api';

function TurnosCalendar() {

    const [eventos, setEventos] =
        useState([]);

    // OBTENER TURNOS

    useEffect(() => {

        obtenerTurnos();

    }, []);

    const obtenerTurnos = async () => {

        try {

            const respuesta =
                await api.get('/turnos');

            const turnos =
                respuesta.data.map((t) => ({

                    id: t.id,

                    title:
                        `${t.servicio} - ${t.estado}`,

                    date:
                        `${t.fecha}T${t.hora}`,

                    backgroundColor:
                        t.estado === 'finalizado'
                            ? '#00c851'
                            : t.estado === 'cancelado'
                                ? '#ff4444'
                                : t.estado === 'confirmado'
                                    ? '#33b5e5'
                                    : '#d4af37',

                    borderColor:
                        t.estado === 'finalizado'
                            ? '#00c851'
                            : t.estado === 'cancelado'
                                ? '#ff4444'
                                : t.estado === 'confirmado'
                                    ? '#33b5e5'
                                    : '#d4af37',

                    textColor: '#fff'
                }));

            setEventos(turnos);

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div
            style={containerStyle}
        >

            <h2
                style={titleStyle}
            >
                Calendario de Turnos
            </h2>

            <FullCalendar

                locale={esLocale}

                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin
                ]}

                initialView="dayGridMonth"

                events={eventos}

                height="auto"

                headerToolbar={{

                    left:
                        'prev,next today',

                    center:
                        'title',

                    right:
                        'dayGridMonth,timeGridWeek'
                }}

                buttonText={{

                    today: 'Hoy',

                    month: 'Mes',

                    week: 'Semana'
                }}

            />

        </div>
    );
}


// ESTILOS

const containerStyle = {

    marginTop: '50px',

    backgroundColor: '#111',

    padding: '30px',

    borderRadius: '20px',

    border: '1px solid #d4af37',

    boxShadow:
        '0 0 20px rgba(212,175,55,0.15)'
};

const titleStyle = {

    color: '#d4af37',

    marginBottom: '25px',

    fontWeight: 'bold',

    letterSpacing: '2px'
};

export default TurnosCalendar;