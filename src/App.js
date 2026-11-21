import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import LandingHome from './componentes/LandingHome';
import Login from './paginas/Login';
import Dashboard from './paginas/Dashboard';
import ProtectedRoute from './componentes/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* HOME PÚBLICA */}
                <Route path="/" element={<LandingHome />} />

                {/* LOGIN */}
                <Route path="/login" element={<Login />} />

                {/* DASHBOARD PROTEGIDO */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;