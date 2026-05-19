import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./usuarios.css";

function Usuarios() {

    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const [usuarios, setUsuarios] = useState([]);

    const navigate = useNavigate();

    // 🔄 cargar usuarios
    const cargarUsuarios = async () => {

        try {

            const res = await api.get("/usuarios", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsuarios(res.data);

        } catch (error) {

            alert("Error al cargar usuarios");

        }
    };

    // 🗑 eliminar usuario
    const eliminar = async (id) => {

        if (id === usuario.id) {
            alert("No puedes eliminar tu propio usuario");
            return;
        }

        if (!window.confirm("¿Eliminar usuario?")) return;

        try {

            await api.delete(`/usuarios/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Usuario eliminado");
            cargarUsuarios();

        } catch (error) {
            alert("Error al eliminar usuario");
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // 🔒 seguridad frontend extra
    if (usuario?.rol !== "admin") {
        return <h1>No autorizado</h1>;
    }

    return (
        <div className="usuarios-container">

            {/* PANEL CENTRAL */}
            <div className="usuarios-panel">

                {/* HEADER */}
                <div className="usuarios-header">

                    <h1>👥 Gestión de Usuarios</h1> 

                    <div className="usuarios-actions-top">

                        <button
                            className="secondary"
                            onClick={() => navigate("/dashboard")}
                        >
                            ⬅ Dashboard
                        </button>

                        <button
                            onClick={() => navigate("/crear-usuario")}
                        >
                            ➕ Nuevo Usuario
                        </button>

                    </div>

                </div>

                {/* TABLA */}
                <div className="usuarios-table-wrapper">

                    <table className="usuarios-table">

                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            {usuarios.map((u) => (

                                <tr key={u.id}>

                                    <td className="user-name">
                                        {u.nombre}
                                    </td>

                                    <td>
                                        <span className={`role ${u.rol}`}>
                                            {u.rol}
                                        </span>
                                    </td>

                                    <td>

                                        <button
                                            className="danger"
                                            onClick={() => eliminar(u.id)}
                                        >
                                            Eliminar
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );

}

export default Usuarios;