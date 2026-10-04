import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import Login from './paginas/Login';
import Dashboard from './paginas/Dashboard';

import ProtectedRoute from './componentes/ProtectedRoute';

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/"
                    element={<Login />}
                />

                {/* DASHBOARD */}

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