import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Hallazgos from "./pages/Hallazgos";
import CrearHallazgo from "./pages/CrearHallazgo";
import EditarHallazgo from "./pages/EditarHallazgo";
import ProtectedRoute from "./routes/ProtectedRoute";
import HistorialCambios from "./pages/HistorialCambios";
import Auditoria from "./pages/Auditoria";
import CrearUsuario from "./pages/CrearUsuario";
import CambiarPassword from "./pages/CambiarPassoword";
import Usuarios from "./pages/Usuarios";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/hallazgos"
                    element={
                        <ProtectedRoute>
                            <Hallazgos />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/crear-hallazgo"
                    element={
                        <ProtectedRoute>
                            <CrearHallazgo />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/editar-hallazgo/:id"
                    element={<EditarHallazgo />}
                />

                <Route
                    path="/historial-cambios"
                    element={<HistorialCambios />

                    }
                />

                <Route
                    path="/auditoria"
                    element={<Auditoria />}
                />

                <Route
                    path="/crear-usuario"
                    element={<CrearUsuario />}
                />

                <Route
                    path="/cambiar-password"
                    element={<CambiarPassword />}
                />

                <Route
                    path="/usuarios"
                    element={
                        <ProtectedRoute>
                            <Usuarios />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;