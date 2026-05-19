import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");


        api.get(
            "/perfil",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

            .then(res => {

                setUsuario(
                    res.data.usuario
                );

            })

            .catch(() => {

                alert("Sesión inválida");

            });

    }, []);

    //cierre cesion (vaciar token)
    async function logout() {

        const token = localStorage.getItem("token");

        await fetch("http://localhost:3000/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        localStorage.clear();

        navigate("/");
    }

    return (

        <div>

            <h1>Panel</h1>

            <button onClick={() => navigate("/hallazgos")}>
                Ver Hallazgos
            </button>

            <button onClick={() => navigate("/crear-hallazgo")}>
                Crear Hallazgo
            </button>

            <button onClick={() => navigate("/historial-cambios")}>
                Historial de cambios
            </button>

            {usuario?.rol === "admin" && (
                <button onClick={() => navigate("/crear-usuario")}>
                    Registrar un usuario
                </button>
            )}

            {usuario?.rol === "admin" && (
                <button
                    onClick={() =>
                        navigate("/auditoria")
                    }
                >
                    Auditoría
                </button>
            )}

            <div>
                <h3>Acciones de usuario</h3>

                <button onClick={() => navigate("/cambiar-password")}>
                    Cambiar contraseña
                </button>

                <button onClick={logout}>
                    Cerrar sesión
                </button>
            </div>

            {usuario && (

                <div>

                    <h3>
                        Bienvenido, {usuario.nombre}
                    </h3>

                    <p>ID: {usuario.id}</p>

                    <p>Rol: {usuario.rol}</p>

                    <p>Correo: {usuario.correo}</p>

                </div>

            )}

        </div>

    );

}

export default Dashboard;