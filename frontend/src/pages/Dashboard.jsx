import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {

        const token = localStorage.getItem("token");

        api.get(
            "/protegida",
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

    return (

        <div>

            <h1>Dashboard</h1>

            {usuario && (

                <div>

                    <p>ID: {usuario.id}</p>

                    <p>Rol: {usuario.rol}</p>

                </div>

            )}

        </div>

    );

}

export default Dashboard;