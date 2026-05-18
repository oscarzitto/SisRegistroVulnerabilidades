import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Auditoria() {

    const [logs, setLogs] = useState([]);

    const token =
        localStorage.getItem("token");

    const navigate =
        useNavigate();

    const [filtro, setFiltro] =
        useState("");

    useEffect(() => {

        fetch(
            "http://localhost:3000/auditoria",
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )

            .then(res => res.json())

            .then(data => {

                setLogs(data);

            });

    }, []);

    return (

        <div>

            <h1>
                Auditoría
            </h1>

            <button
                onClick={() => navigate(-1)}
            >
                Volver
            </button>

            <input
                placeholder=
                "Buscar evento..."
                onChange={(e) =>

                    setFiltro(
                        e.target.value
                    )

                }
            />

            {

                logs

                    .filter(l =>

                        l.evento
                            .toLowerCase()
                            .includes(
                                filtro.toLowerCase()
                            )

                    )

                    .map(log => (

                        <div
                            key={log.id}

                            style={{

                                border:
                                    "1px solid gray",

                                padding: "10px",

                                margin: "10px"

                            }}
                        >

                            <p>
                                <b>Usuario:</b>
                                {log.usuario}
                            </p>

                            <p>
                                <b>Evento:</b>
                                {log.evento}
                            </p>

                            <p>
                                <b>Fecha:</b>
                                {log.fecha}
                            </p>

                        </div>

                    ))

            }

        </div>

    );

}

export default Auditoria;