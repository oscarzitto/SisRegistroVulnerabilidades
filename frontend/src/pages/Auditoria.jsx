import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auditoria.css";

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
        <div className="auditoria-container">

            {/* HEADER */}
            <div className="auditoria-header">

                <h1>📊 Auditoría del Sistema</h1>

                <button className="secondary" onClick={() => navigate(-1)}>
                    ⬅ Volver
                </button>

            </div>

            {/* FILTROS */}
            <div className="auditoria-filters">

                <select
                    name="usuario"
                    value={filtros.usuario}
                    onChange={cambiarFiltro}
                >
                    <option value="">Todos los usuarios</option>

                    {usuariosUnicos.map((u, i) => (
                        <option key={i} value={u}>
                            {u}
                        </option>
                    ))}

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

                <button onClick={limpiarFiltros}>
                    🧹 Limpiar
                </button>

            </div>

            {/* LISTA LOGS */}
            <div className="auditoria-list">

                {logs
                    .filter(l => (
                        (!filtros.usuario || l.usuario === filtros.usuario) &&
                        (!filtros.desde || l.fecha.substring(0, 10) >= filtros.desde) &&
                        (!filtros.hasta || l.fecha.substring(0, 10) <= filtros.hasta)
                    ))
                    .map(log => (

                        <div className="audit-card" key={log.id}>

                            <div className="audit-top">

                                <h3>{log.usuario}</h3>

                                <span className="audit-event">
                                    {log.evento}
                                </span>

                            </div>

                            <div className="audit-date">
                                {log.fecha}
                            </div>

                        </div>

                    ))}

            </div>

        </div>
    );

}

export default Auditoria;