import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Auditoria() {

    const [logs, setLogs] = useState([]);

    const usuariosUnicos = [

        ...new Set(
            logs.map(
                l => l.usuario
            )
        )

    ];

    const token =
        localStorage.getItem("token");

    const navigate =
        useNavigate();

    const [filtros, setFiltros] = useState({
        usuario: "",
        desde: "",
        hasta: ""
    });

    function cambiarFiltro(e) {

        setFiltros({

            ...filtros,

            [e.target.name]:
                e.target.value

        });

    }

    function limpiarFiltros() {

        setFiltros({

            usuario: "",
            desde: "",
            hasta: ""

        });

    }

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

            <button className="secondary"
                onClick={() => navigate(-1)}
            >
                Volver
            </button>

            <div
                style={{
                    marginBottom: "20px"
                }}
            >

                <select
                    name="usuario"
                    value={filtros.usuario}
                    onChange={cambiarFiltro}
                >

                    <option value="">
                        Todos los usuarios
                    </option>

                    {
                        usuariosUnicos.map((u, i) => (

                            <option
                                key={i}
                                value={u}
                            >
                                {u}
                            </option>

                        ))
                    }

                </select>

                <input
                    type="date"
                    name="desde"
                    value={filtros.desde}
                    onChange={cambiarFiltro}
                />

                <input
                    type="date"
                    name="hasta"
                    value={filtros.hasta}
                    onChange={cambiarFiltro}
                />

                <button
                    onClick={limpiarFiltros}
                >
                    Limpiar filtros
                </button>

            </div>

            {

                logs

                    .filter(l => {

                        const cumpleUsuario =

                            !filtros.usuario ||

                            l.usuario === filtros.usuario;


                        const cumpleDesde =

                            !filtros.desde ||

                            l.fecha.substring(0, 10)
                            >=
                            filtros.desde;


                        const cumpleHasta =

                            !filtros.hasta ||

                            l.fecha.substring(0, 10)
                            <=
                            filtros.hasta;


                        return (

                            cumpleUsuario
                            &&
                            cumpleDesde
                            &&
                            cumpleHasta

                        );

                    })

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