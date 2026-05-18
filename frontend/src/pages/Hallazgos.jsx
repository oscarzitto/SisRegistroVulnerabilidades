import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Hallazgos() {

    const [token] = useState(
        localStorage.getItem("token")
    );

    const [hallazgos, setHallazgos] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        fetch(
            "http://localhost:3000/hallazgos",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

            .then(res => res.json())

            .then(data => {

                setHallazgos(data);

            });

    }, []);

    async function editar(h) {

        const nuevoEstado =
            prompt(
                "Nuevo estado:"
            );

        if (!nuevoEstado) return;

        await fetch(

            `http://localhost:3000/hallazgos/${h.id}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({

                    fecha: h.fecha,
                    activo_afectado: h.activo_afectado,
                    tipo: h.tipo,
                    severidad: h.severidad,
                    descripcion: h.descripcion,
                    evidencia: h.evidencia,
                    recomendacion: h.recomendacion,
                    estado: nuevoEstado,
                    responsable: h.responsable

                })

            }

        );

        window.location.reload();

    }

    const [filtro, setFiltro] = useState("");

    async function exportar() {

        const token = localStorage.getItem("token");

        const res = await fetch(

            "http://localhost:3000/exportar",

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        const blob = await res.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "hallazgos.csv";

        a.click();

    }

    return (

        <div>

            <h1>Hallazgos</h1>

            <input
                placeholder="Buscar por tipo..."
                onChange={(e) => setFiltro(e.target.value)}
            />

            <button onClick={() => navigate("/crear-hallazgo")}>
                Crear Hallazgo
            </button>

            <button onClick={exportar}>
            Exportar CSV
            </button>

            <button onClick={() => navigate(-1)}>
                Volver
            </button>

            {hallazgos

                .filter(h =>

                    h.tipo
                        .toLowerCase()
                        .includes(
                            filtro.toLowerCase()
                        )

                )

                .map(h => (

                    <div
                        key={h.id}
                        style={{
                            border: "1px solid gray",
                            padding: "10px",
                            margin: "10px"
                        }}
                    >

                        <p><b>ID:</b> {h.id}</p>

                        <p><b>Activo:</b> {h.activo_afectado}</p>

                        <p><b>Tipo:</b> {h.tipo}</p>

                        <p><b>Severidad:</b> {h.severidad}</p>

                        <p><b>Descripción:</b> {h.descripcion}</p>

                        <p><b>Evidencia:</b> {h.evidencia}</p>

                        <p><b>Estado:</b> {h.estado}</p>

                        <p><b>Responsable:</b> {h.responsable}</p>

                        <button
                            onClick={() => editar(h)}
                        >

                            Cambiar estado

                        </button>

                        <hr />

                    </div>

                ))}

        </div>

    );

}

export default Hallazgos;