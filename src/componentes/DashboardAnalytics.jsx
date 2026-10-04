import { useEffect, useState } from 'react';

import api from '../services/api';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';

function DashboardAnalytics() {

    const [stats, setStats] =
        useState(null);

    useEffect(() => {

        obtenerStats();

    }, []);

    const obtenerStats = async () => {

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

            <h2
                style={{
                    color: '#d4af37'
                }}
            >
                Cargando estadísticas...
            </h2>

        );
    }

    const datos = [

        {
            nombre: 'Pendientes',
            turnos: stats.pendientes
        },

        {
            nombre: 'Confirmados',
            turnos: stats.confirmados
        },

        {
            nombre: 'Cancelados',
            turnos: stats.cancelados
        },

        {
            nombre: 'Finalizados',
            turnos: stats.finalizados
        }
    ];

    return (

        <div style={containerStyle}>

            {/* CARDS */}

            <div style={cardsContainer}>

                <div style={cardStyle}>

                    <h3 style={numberStyle}>
                        {stats.clientes}
                    </h3>

                    <p style={labelStyle}>
                        Clientes
                    </p>

                </div>

                <div style={cardStyle}>

                    <h3 style={numberStyle}>
                        {stats.peluqueros}
                    </h3>

                    <p style={labelStyle}>
                        Barberos / Peluqueros
                    </p>

                </div>

                <div style={cardStyle}>

                    <h3 style={numberStyle}>
                        {stats.finalizados}
                    </h3>

                    <p style={labelStyle}>
                        Turnos completados
                    </p>

                </div>

                <div style={cardStyle}>

                    <h3 style={numberStyle}>
                        $
                        {stats.ingresos.toLocaleString()}
                    </h3>

                    <p style={labelStyle}>
                        Ingresos
                    </p>

                </div>

            </div>

            {/* SEGUNDA FILA */}

            <div
                style={{
                    ...cardsContainer,
                    marginBottom: '40px'
                }}
            >

                <div style={cardStyle}>

                    <h3 style={numberStyle}>
                        {stats.administradores}
                    </h3>

                    <p style={labelStyle}>
                        Administradores
                    </p>

                </div>

                <div style={cardStyle}>

                    <h3 style={numberStyle}>
                        {stats.totalTurnos}
                    </h3>

                    <p style={labelStyle}>
                        Total Turnos
                    </p>

                </div>

                <div style={cardStyle}>

                    <h3 style={numberStyle}>
                        {stats.pendientes}
                    </h3>

                    <p style={labelStyle}>
                        Pendientes
                    </p>

                </div>

                <div style={cardStyle}>

                    <h3 style={numberStyle}>
                        {stats.confirmados}
                    </h3>

                    <p style={labelStyle}>
                        Confirmados
                    </p>

                </div>

            </div>

            {/* GRAFICO */}

            <div style={chartContainer}>

                <h2 style={chartTitle}>
                    Estado de Turnos
                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <BarChart
                        data={datos}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#222"
                        />

                        <XAxis
                            dataKey="nombre"
                            stroke="#d4af37"
                        />

                        <YAxis
                            stroke="#d4af37"
                        />

                        <Tooltip />

                        <Bar
                            dataKey="turnos"
                            fill="#d4af37"
                            radius={[8, 8, 0, 0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}


// ESTILOS

const containerStyle = {
    marginTop: '50px'
};

const cardsContainer = {
    display: 'grid',
    gridTemplateColumns:
        'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
};

const cardStyle = {
    backgroundColor: '#111',
    border: '1px solid #d4af37',
    borderRadius: '20px',
    padding: '30px',
    boxShadow:
        '0 0 20px rgba(212,175,55,0.15)'
};

const numberStyle = {
    color: '#d4af37',
    fontSize: '40px',
    marginBottom: '10px'
};

const labelStyle = {
    color: '#fff'
};

const chartContainer = {
    backgroundColor: '#111',
    border: '1px solid #d4af37',
    borderRadius: '20px',
    padding: '30px',
    boxShadow:
        '0 0 20px rgba(212,175,55,0.15)'
};

const chartTitle = {
    color: '#d4af37',
    marginBottom: '20px'
};

export default DashboardAnalytics;