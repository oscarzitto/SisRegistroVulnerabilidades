import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HistorialCambios() {

    const [historial, setHistorial] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {

        fetch("http://localhost:3000/historial", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setHistorial(data));

    }, []);

    return (
        <div>

            <h1>Historial de cambios</h1>

            <button onClick={() => navigate(-1)}>
                Volver
            </button>

            {historial.map(h => (
                <div
                    key={h.id}
                    style={{
                        border: "1px solid gray",
                        padding: "10px",
                        margin: "10px"
                    }}
                >

                    <p><b>Usuario:</b> {h.usuario}</p>
                    <p><b>Acción:</b> {h.accion}</p>
                    <p><b>Detalle:</b> {h.detalle}</p>
                    <p><b>Fecha:</b> {h.fecha}</p>
                    <p><b>ID Hallazgo:</b> {h.hallazgo_id}</p>

                </div>
            ))}

        </div>
    );
}

export default HistorialCambios;