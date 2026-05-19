import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

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

        const confirmar = window.confirm(
            "¿Seguro que quieres cerrar sesión?"
        );

        if (!confirmar) return;

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
        <div className="dashboard-layout">

            {/* SIDEBAR */}
            <aside className="dashboard-sidebar">

                <div className="sidebar-title">
                    🛡 Sistema Vulnerabilidades
                </div>

                {usuario && (
                    <div className="sidebar-user">

                        <h3>{usuario.nombre}</h3>

                        <p><b>Rol:</b> {usuario.rol}</p>
                        <p><b>ID:</b> {usuario.id}</p>

                    </div>
                )}

                <div className="sidebar-actions">

                    {usuario?.rol === "admin" && (
                        <>
                            <button onClick={() => navigate("/usuarios")}>
                                👥 Usuarios
                            </button>

                            <button onClick={() => navigate("/auditoria")}>
                                📊 Auditoría
                            </button>
                        </>
                    )}

                    <button onClick={() => navigate("/cambiar-password")}>
                        🔐 Cambiar contraseña
                    </button>

                </div>

                <button className="danger" onClick={logout}>
                    🚪 Cerrar sesión
                </button>

            </aside>

            {/* CONTENIDO */}
            <main className="dashboard-main">

                <h1>📊 Panel de Control</h1>

                <p className="dashboard-subtitle">
                    Gestión de vulnerabilidades del sistema
                </p>

                <div className="dashboard-cards">

                    <div className="card">
                        <h2>🔎 Hallazgos</h2>
                        <p>Gestiona vulnerabilidades detectadas en el sistema.</p>
                        <button onClick={() => navigate("/hallazgos")}>
                            Ver hallazgos
                        </button>
                    </div>

                    <div className="card">
                        <h2>➕ Registro</h2>
                        <p>Crear nuevos hallazgos de seguridad.</p>
                        <button onClick={() => navigate("/crear-hallazgo")}>
                            Crear hallazgo
                        </button>
                    </div>

                    {usuario?.rol === "admin" && (
                        <div className="card highlight">
                            <h2>👑 Administración</h2>
                            <p>Gestión de usuarios y auditoría del sistema.</p>
                            <button onClick={() => navigate("/usuarios")}>
                                Gestionar usuarios
                            </button>
                        </div>
                    )}

                </div>

            </main>

        </div>
    );

}

export default Dashboard;