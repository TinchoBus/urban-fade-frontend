import {
    FaHome,
    FaUsers,
    FaCalendarAlt,
    FaCog,
    FaHistory,
    FaCut
} from 'react-icons/fa';

function Sidebar({ seccionActiva, cambiarSeccion }) {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );

    const obtenerEstiloItem = (seccion) => ({
        ...itemStyle,
        backgroundColor:
            seccionActiva === seccion
                ? '#d4af37'
                : '#111',
        color:
            seccionActiva === seccion
                ? '#000'
                : '#fff'
    });

    return (

        <div
            style={{
                width: '260px',
                height: '100vh',
                backgroundColor: '#0a0a0a',
                borderRight: '1px solid #d4af37',
                padding: '30px 20px',
                position: 'fixed',
                left: 0,
                top: 0,
                overflowY: 'auto'
            }}
        >

            {/* LOGO */}

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '50px'
                }}
            >

                <div
                    style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        border: '2px solid #d4af37',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#d4af37',
                        fontSize: '28px',
                        fontWeight: 'bold',
                        boxShadow:
                            '0 0 15px rgba(212,175,55,0.4)'
                    }}
                >
                    UF
                </div>

                <p
                    style={{
                        color: '#d4af37',
                        marginTop: '15px',
                        letterSpacing: '3px',
                        fontSize: '14px'
                    }}
                >
                    URBAN FADE
                </p>

            </div>

            {/* MENÚ */}

            <ul
                style={{
                    listStyle: 'none',
                    padding: 0
                }}
            >

                <li
                    style={obtenerEstiloItem('inicio')}
                    onClick={() => cambiarSeccion('inicio')}
                >
                    <FaHome />
                    <span>Inicio</span>
                </li>

                {
                    usuario?.rol === 'administrador' && (

                        <>

                            <li
                                style={obtenerEstiloItem('usuarios')}
                                onClick={() =>
                                    cambiarSeccion('usuarios')
                                }
                            >
                                <FaUsers />
                                <span>Usuarios</span>
                            </li>

                            <li
                                style={obtenerEstiloItem('turnos')}
                                onClick={() =>
                                    cambiarSeccion('turnos')
                                }
                            >
                                <FaCalendarAlt />
                                <span>Turnos</span>
                            </li>

                            <li
                                style={obtenerEstiloItem('configuracion')}
                                onClick={() =>
                                    cambiarSeccion('configuracion')
                                }
                            >
                                <FaCog />
                                <span>Configuración</span>
                            </li>

                        </>

                    )
                }

                {
                    usuario?.rol === 'peluquero' && (

                        <>

                            <li
                                style={obtenerEstiloItem('mis-turnos')}
                                onClick={() =>
                                    cambiarSeccion('mis-turnos')
                                }
                            >
                                <FaCut />
                                <span>Mis Turnos</span>
                            </li>

                            <li
                                style={obtenerEstiloItem('agenda')}
                                onClick={() =>
                                    cambiarSeccion('agenda')
                                }
                            >
                                <FaCalendarAlt />
                                <span>Agenda</span>
                            </li>

                            <li
                                style={obtenerEstiloItem('historial')}
                                onClick={() =>
                                    cambiarSeccion('historial')
                                }
                            >
                                <FaHistory />
                                <span>Historial</span>
                            </li>

                        </>

                    )
                }

                {
                    usuario?.rol === 'cliente' && (

                        <>

                            <li
                                style={obtenerEstiloItem('mis-turnos')}
                                onClick={() =>
                                    cambiarSeccion('mis-turnos')
                                }
                            >
                                <FaHistory />
                                <span>Mis Turnos</span>
                            </li>

                            <li
                                style={obtenerEstiloItem('favoritos')}
                                onClick={() =>
                                    cambiarSeccion('favoritos')
                                }
                            >
                                <FaUsers />
                                <span>Favoritos</span>
                            </li>

                            <li
                                style={obtenerEstiloItem('perfil')}
                                onClick={() =>
                                    cambiarSeccion('perfil')
                                }
                            >
                                <FaCog />
                                <span>Mi Perfil</span>
                            </li>

                        </>

                    )
                }

            </ul>

        </div>

    );
}

const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: '0.3s',
    fontWeight: '500'
};

export default Sidebar;