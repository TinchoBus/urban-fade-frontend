import { useState } from 'react';

import Navbar from '../componentes/Navbar';
import Sidebar from '../componentes/Sidebar';
import DashboardAnalytics from '../componentes/DashboardAnalytics';
import UsersTable from '../componentes/UsersTable';
import TurnosTable from '../componentes/TurnosTable';
import TurnosCalendar from '../componentes/TurnosCalendar';
import ClienteHome from '../componentes/ClienteHome';
import MisTurnosCliente from '../cliente/MisTurnosCliente';
import FavoritosCliente from '../cliente/FavoritosCliente';
import MiPerfilCliente from '../cliente/MiPerfilCliente';
import ConfiguracionGeneral from '../componentes/ConfiguracionGeneral';
import ConfiguracionHorarios from '../componentes/ConfiguracionHorarios';
import ConfiguracionFechasEspeciales from '../componentes/ConfiguracionFechasEspeciales';
import Footer from '../componentes/Footer';


function Dashboard() {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );

    const [seccionActiva, setSeccionActiva] =
        useState('inicio');


    const cambiarSeccion = (seccion) => {

        setSeccionActiva(seccion);

    };


    const InicioPeluquero = () => (

        <div>

            <div style={heroPeluqueroStyle}>

                <div>

                    <p style={etiquetaStyle}>
                        PANEL PROFESIONAL
                    </p>

                    <h2 style={heroTituloStyle}>
                        Hola {usuario?.nombre} 👋
                    </h2>

                    <p style={heroTextoStyle}>
                        Bienvenido a tu espacio de trabajo en Urban Fade.
                        Desde el menú lateral podés administrar tus turnos,
                        revisar tu agenda y consultar tu historial.
                    </p>

                </div>

            </div>


            <div style={gridResumenStyle}>

                <div
                    style={resumenCardStyle}
                    onClick={() =>
                        cambiarSeccion('mis-turnos')
                    }
                >

                    <div style={iconoStyle}>
                        ✂️
                    </div>

                    <h3 style={cardTituloStyle}>
                        Mis Turnos
                    </h3>

                    <p style={cardTextoStyle}>
                        Consultá y administrá tus próximos turnos.
                    </p>

                    <span style={accesoStyle}>
                        Ver turnos →
                    </span>

                </div>


                <div
                    style={resumenCardStyle}
                    onClick={() =>
                        cambiarSeccion('agenda')
                    }
                >

                    <div style={iconoStyle}>
                        📅
                    </div>

                    <h3 style={cardTituloStyle}>
                        Agenda
                    </h3>

                    <p style={cardTextoStyle}>
                        Visualizá la planificación de tus próximas jornadas.
                    </p>

                    <span style={accesoStyle}>
                        Ver agenda →
                    </span>

                </div>


                <div
                    style={resumenCardStyle}
                    onClick={() =>
                        cambiarSeccion('historial')
                    }
                >

                    <div style={iconoStyle}>
                        📜
                    </div>

                    <h3 style={cardTituloStyle}>
                        Historial
                    </h3>

                    <p style={cardTextoStyle}>
                        Revisá servicios finalizados y turnos anteriores.
                    </p>

                    <span style={accesoStyle}>
                        Ver historial →
                    </span>

                </div>

            </div>


            <div style={infoStyle}>

                <h3 style={infoTituloStyle}>
                    💈 Urban Fade
                </h3>

                <p style={infoTextoStyle}>
                    Usá este panel como centro de trabajo.
                    Cada sección tiene una función específica para
                    mantener la gestión ordenada y evitar información repetida.
                </p>

            </div>

        </div>

    );


    const renderContenido = () => {

        // =====================================
        // ADMINISTRADOR
        // =====================================

        if (usuario?.rol === 'administrador') {

            if (seccionActiva === 'inicio') {

                return (
                    <>
                        <DashboardAnalytics />
                    </>
                );
            }

            if (seccionActiva === 'usuarios') {

                return (
                    <UsersTable />
                );
            }

            if (seccionActiva === 'turnos') {

                return (
                    <>
                        <TurnosTable />
                        <TurnosCalendar />
                    </>
                );
            }

            if (seccionActiva === 'configuracion') {

                return (
                    <>
                        <ConfiguracionGeneral
                            onVolver={() =>
                                cambiarSeccion('inicio')
                            }
                        />
                        <ConfiguracionHorarios />
                        <ConfiguracionFechasEspeciales />
                    </>
                );
            }
        }


        // =====================================
        // PELUQUERO
        // =====================================

        if (usuario?.rol === 'peluquero') {

            if (seccionActiva === 'inicio') {

                return (
                    <InicioPeluquero />
                );
            }

            if (seccionActiva === 'mis-turnos') {

                return (
                    <TurnosTable />
                );
            }

            if (seccionActiva === 'agenda') {

                return (
                    <TurnosCalendar />
                );
            }

            if (seccionActiva === 'historial') {

                return (

                    <div style={mensajeStyle}>

                        <h2 style={mensajeTituloStyle}>
                            📜 Historial
                        </h2>

                        <p style={mensajeTextoStyle}>
                            Acá vamos a mostrar los turnos finalizados
                            y cancelados del peluquero.
                        </p>

                    </div>

                );
            }
        }


        // =====================================
        // CLIENTE
        // =====================================

        if (usuario?.rol === 'cliente') {

            if (seccionActiva === 'inicio') {

                return (
                    <ClienteHome />
                );
            }

            if (seccionActiva === 'mis-turnos') {

                return (
                    <MisTurnosCliente />
                );
            }

            if (seccionActiva === 'favoritos') {

                return (
                    <FavoritosCliente />
                );
            }

            if (seccionActiva === 'perfil') {

                return (
                    <MiPerfilCliente />
                );
            }
        }


        return null;

    };


    const obtenerTituloSeccion = () => {

        const titulos = {

            inicio: 'Inicio',

            usuarios: 'Usuarios',

            turnos: 'Gestión de Turnos',

            configuracion: 'Configuración',

            'mis-turnos': 'Mis Turnos',

            agenda: 'Agenda',

            historial: 'Historial',

            favoritos: 'Favoritos',

            perfil: 'Mi Perfil'

        };

        return titulos[seccionActiva] || 'Dashboard Urban Fade';

    };


    return (

        <div
            style={{
                backgroundColor: '#0a0a0a',
                minHeight: '100vh'
            }}
        >

            {/* SIDEBAR */}

            <Sidebar
                seccionActiva={seccionActiva}
                cambiarSeccion={cambiarSeccion}
            />


            {/* CONTENIDO */}

            <div
                style={{
                    marginLeft: '260px',
                    padding: '30px'
                }}
            >

                {/* NAVBAR */}

                <Navbar />


                {/* CONTENIDO PRINCIPAL */}

                <div
                    style={{
                        marginTop: '90px'
                    }}
                >

                    <h1 style={tituloPaginaStyle}>
                        {obtenerTituloSeccion()}
                    </h1>


                    {renderContenido()}

                </div>


                {/* FOOTER */}

                <Footer />

            </div>

        </div>

    );
}


/* =====================================
   ESTILOS
===================================== */

const tituloPaginaStyle = {

    color: '#d4af37',

    marginBottom: '30px',

    fontWeight: 'bold',

    letterSpacing: '2px'

};


const heroPeluqueroStyle = {

    backgroundColor: '#111',

    border: '1px solid #d4af37',

    borderRadius: '20px',

    padding: '30px',

    marginBottom: '30px',

    boxShadow:
        '0 0 20px rgba(212,175,55,0.08)'

};


const etiquetaStyle = {

    color: '#888',

    fontSize: '12px',

    letterSpacing: '3px',

    marginBottom: '8px'

};


const heroTituloStyle = {

    color: '#d4af37',

    marginTop: 0,

    marginBottom: '12px',

    fontSize: '28px'

};


const heroTextoStyle = {

    color: '#ccc',

    lineHeight: '1.7',

    margin: 0,

    maxWidth: '760px'

};


const gridResumenStyle = {

    display: 'grid',

    gridTemplateColumns:
        'repeat(auto-fit, minmax(230px, 1fr))',

    gap: '20px',

    marginBottom: '30px'

};


const resumenCardStyle = {

    backgroundColor: '#111',

    border: '1px solid #292929',

    borderRadius: '18px',

    padding: '25px',

    cursor: 'pointer',

    transition: '0.3s'

};


const iconoStyle = {

    fontSize: '28px',

    marginBottom: '15px'

};


const cardTituloStyle = {

    color: '#fff',

    marginTop: 0,

    marginBottom: '10px'

};


const cardTextoStyle = {

    color: '#999',

    lineHeight: '1.5',

    minHeight: '48px'

};


const accesoStyle = {

    color: '#d4af37',

    fontWeight: 'bold',

    fontSize: '13px'

};


const infoStyle = {

    backgroundColor: '#0f0f0f',

    borderLeft: '3px solid #d4af37',

    padding: '20px 25px',

    borderRadius: '10px'

};


const infoTituloStyle = {

    color: '#d4af37',

    marginTop: 0,

    marginBottom: '8px'

};


const infoTextoStyle = {

    color: '#aaa',

    margin: 0,

    lineHeight: '1.6'

};


const mensajeStyle = {

    backgroundColor: '#111',

    border: '1px solid #d4af37',

    borderRadius: '20px',

    padding: '30px',

    marginTop: '30px'

};


const mensajeTituloStyle = {

    color: '#d4af37',

    marginBottom: '15px'

};


const mensajeTextoStyle = {

    color: '#ccc',

    margin: 0

};


export default Dashboard;