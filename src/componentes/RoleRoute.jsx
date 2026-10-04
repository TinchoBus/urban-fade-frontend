import { Navigate } from 'react-router-dom';

function RoleRoute({
    children,
    rolPermitido
}) {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );

    // NO LOGUEADO
    if (!usuario) {

        return <Navigate to="/" />;
    }

    // ROL INCORRECTO
    if (usuario.rol !== rolPermitido) {

        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default RoleRoute;