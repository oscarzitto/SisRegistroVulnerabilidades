import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

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

        <div>

            <h1>Gestión de Usuarios</h1>

            <div style={{ marginBottom: "20px" }}>

                <button onClick={() => navigate("/dashboard")}>
                    ⬅ Volver al Dashboard
                </button>

                <button
                    onClick={() => navigate("/crear-usuario")}
                    style={{ marginLeft: "10px" }}
                >
                    ➕ Agregar usuario
                </button>

            </div>

            <table border="1" cellPadding="8">

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

                            <td>{u.nombre}</td>
                            <td>{u.rol}</td>

                            <td>

                                <button
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

    );

}

export default Usuarios;