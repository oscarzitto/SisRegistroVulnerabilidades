import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Hallazgos from "./pages/Hallazgos";
import CrearHallazgo from "./pages/CrearHallazgo";
import EditarHallazgo from "./pages/EditarHallazgo";
import ProtectedRoute from "./routes/ProtectedRoute";

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

            </Routes>

        </BrowserRouter>

    );

}

export default App;