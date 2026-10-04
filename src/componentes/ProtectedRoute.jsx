import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {

    const token = localStorage.getItem('token');

    // SI NO HAY TOKEN
    if (!token) {

        return <Navigate to="/" />;
    }

    // SI HAY TOKEN
    return children;
}

export default ProtectedRoute;