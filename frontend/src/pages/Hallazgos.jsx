import { useEffect, useState } from "react";

function Hallazgos() {

    const [token] = useState(
        localStorage.getItem("token")
    );

    const [hallazgos, setHallazgos] = useState([]);

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

    return (

        <div>

            <h1>Hallazgos</h1>

            {hallazgos.map(h => (

                <div
                    key={h.id}
                    // ESTILO PARA SEPARAR CADA HALLAZGO (quizas quitarlo despues)
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

                    <hr />

                </div>

            ))}

        </div>

    );

}

export default Hallazgos;