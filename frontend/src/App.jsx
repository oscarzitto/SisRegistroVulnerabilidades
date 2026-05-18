import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Hallazgos from "./pages/Hallazgos";
import CrearHallazgo from "./pages/CrearHallazgo";

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
                    element={<Dashboard />}
                />

                <Route
                    path="/hallazgos"
                    element={<Hallazgos />}
                />

                <Route
                    path="/crear-hallazgo"
                    element={<CrearHallazgo />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;