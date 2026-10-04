import { useEffect, useState } from 'react';
import api from '../services/api';

function DashboardCards() {

    const [stats, setStats] = useState(null);

    useEffect(() => {
        cargarStats();
    }, []);

    const cargarStats = async () => {

        try {

            const respuesta =
                await api.get(
                    '/dashboard/estadisticas'
                );

            setStats(
                respuesta.data
            );

        } catch (error) {

            console.log(error);
        }
    };

    if (!stats) {

        return (
            <h3
                style={{
                    color: '#d4af37',
                    marginTop: '30px'
                }}
            >
                Cargando estadísticas...
            </h3>
        );
    }

    const cards = [

        {
            titulo: 'Clientes',
            valor: stats.clientes
        },

        {
            titulo: 'Barberos / Peluqueros',
            valor: stats.peluqueros
        },

        {
            titulo: 'Turnos Completados',
            valor: stats.finalizados
        },

        {
            titulo: 'Ingresos',
            valor:
                '$' +
                stats.ingresos.toLocaleString()
        }

    ];

    return (

        <div
            style={{
                display: 'grid',
                gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '25px',
                marginTop: '40px'
            }}
        >

            {
                cards.map((card, index) => (

                    <div
                        key={index}
                        style={{
                            backgroundColor: '#111',
                            border:
                                '1px solid #d4af37',
                            borderRadius: '18px',
                            padding: '30px',
                            boxShadow:
                                '0 0 20px rgba(212,175,55,0.15)'
                        }}
                    >

                        <h3
                            style={{
                                color: '#999',
                                marginBottom: '15px'
                            }}
                        >
                            {card.titulo}
                        </h3>

                        <h1
                            style={{
                                color: '#d4af37',
                                margin: 0,
                                fontSize: '42px'
                            }}
                        >
                            {card.valor}
                        </h1>

                    </div>
                ))
            }

        </div>
    );
}

export default DashboardCards;