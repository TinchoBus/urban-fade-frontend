import { useState } from 'react';
import ReservaTurnoModal from '../cliente/ReservaTurnoModal';

function ClienteHome() {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );

    const [mostrarModal, setMostrarModal] =
        useState(false);

    return (

        <div
            style={{
                marginTop: '30px'
            }}
        >

            {/* BIENVENIDA */}

            <div style={heroStyle}>

                <h1 style={heroTitle}>
                    Hola {usuario?.nombre} 👋
                </h1>

                <p style={heroText}>
                    Bienvenido nuevamente a Urban Fade
                </p>

            </div>

            {/* GRID */}

            <div style={gridStyle}>

                {/* PROXIMO TURNO */}

                <div style={cardStyle}>

                    <h2 style={titleStyle}>
                        📅 Próximo Turno
                    </h2>

                    <p style={textStyle}>
                        Todavía no tenés turnos reservados
                    </p>

                    <button
                        style={buttonStyle}
                        onClick={() =>
                            setMostrarModal(true)
                        }
                    >
                        Reservar Turno
                    </button>

                </div>

                {/* PUNTOS */}

                <div style={cardStyle}>

                    <h2 style={titleStyle}>
                        🔥 Urban Points
                    </h2>

                    <h1 style={numberStyle}>
                        8
                    </h1>

                    <p style={textStyle}>
                        Servicios realizados
                    </p>

                    <p style={goldText}>
                        Te faltan 2 cortes para obtener
                        un 20% de descuento
                    </p>

                </div>

            </div>

            {/* SERVICIOS */}

            <div style={sectionStyle}>

                <h2 style={sectionTitle}>
                    ✂️ Servicios Disponibles
                </h2>

                <div style={gridStyle}>

                    <div style={serviceCard}>
                        <h3>✂️ Corte Clásico</h3>
                        <p>$8.000</p>
                    </div>

                    <div style={serviceCard}>
                        <h3>🔥 Fade</h3>
                        <p>$10.000</p>
                    </div>

                    <div style={serviceCard}>
                        <h3>🧔 Corte + Barba</h3>
                        <p>$12.000</p>
                    </div>

                    <div style={serviceCard}>
                        <h3>👦 Corte Infantil</h3>
                        <p>$6.000</p>
                    </div>

                </div>

            </div>

            {/* PELUQUEROS */}

            <div style={sectionStyle}>

                <h2 style={sectionTitle}>
                    ⭐ Nuestros Profesionales
                </h2>

                <div style={gridStyle}>

                    <div style={cardStyle}>
                        <h3>✂️ Juan Pérez</h3>
                        <p>Especialista en Fade</p>
                        <p>⭐⭐⭐⭐⭐</p>
                    </div>

                    <div style={cardStyle}>
                        <h3>✂️ Matías López</h3>
                        <p>Especialista en Barba</p>
                        <p>⭐⭐⭐⭐⭐</p>
                    </div>

                    <div style={cardStyle}>
                        <h3>✂️ Lucas Gómez</h3>
                        <p>Cortes Modernos</p>
                        <p>⭐⭐⭐⭐⭐</p>
                    </div>

                </div>

            </div>

            {/* HISTORIAL */}

            <div style={sectionStyle}>

                <h2 style={sectionTitle}>
                    📜 Historial de Servicios
                </h2>

                <table style={tableStyle}>

                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Servicio</th>
                            <th>Peluquero</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td>10/06/2026</td>
                            <td>Fade</td>
                            <td>Juan</td>
                        </tr>

                        <tr>
                            <td>25/05/2026</td>
                            <td>Corte + Barba</td>
                            <td>Matías</td>
                        </tr>

                    </tbody>

                </table>

            </div>

            {/* MODAL DE RESERVA */}

            <ReservaTurnoModal
                abierto={mostrarModal}
                onClose={() =>
                    setMostrarModal(false)
                }
            />

        </div>
    );
}

/* ESTILOS */

const heroStyle = {
    backgroundColor: '#111',
    border: '1px solid #d4af37',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '30px'
};

const heroTitle = {
    color: '#d4af37',
    marginBottom: '10px'
};

const heroText = {
    color: '#ccc'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns:
        'repeat(auto-fit,minmax(280px,1fr))',
    gap: '20px',
    marginBottom: '30px'
};

const cardStyle = {
    backgroundColor: '#111',
    border: '1px solid #d4af37',
    borderRadius: '20px',
    padding: '25px'
};

const titleStyle = {
    color: '#d4af37',
    marginBottom: '15px'
};

const textStyle = {
    color: '#ccc'
};

const goldText = {
    color: '#d4af37',
    marginTop: '15px'
};

const numberStyle = {
    color: '#d4af37',
    fontSize: '48px'
};

const buttonStyle = {
    backgroundColor: '#d4af37',
    color: '#000',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '15px'
};

const sectionStyle = {
    marginBottom: '35px'
};

const sectionTitle = {
    color: '#d4af37',
    marginBottom: '20px'
};

const serviceCard = {
    backgroundColor: '#111',
    border: '1px solid #d4af37',
    borderRadius: '20px',
    padding: '25px',
    color: '#fff'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#111',
    color: '#fff',
    border: '1px solid #d4af37'
};

export default ClienteHome;