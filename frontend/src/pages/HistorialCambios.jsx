import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./historialcambios.css";

function HistorialCambios() {

    const [historial, setHistorial] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [filtros, setFiltros] = useState({

        usuario: "",
        accion: "",
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
            accion: "",
            desde: "",
            hasta: ""

        });

    }

    const usuariosUnicos = [

        ...new Set(
            historial.map(
                h => h.usuario
            ))

    ];

    const accionesUnicas = [

        ...new Set(
            historial.map(
                h => h.accion
            ))

    ];

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
        <div className="historial-container">

            {/* HEADER */}
            <div className="historial-header">

                <h1>📜 Historial de Auditoría</h1>

                <button className="secondary" onClick={() => navigate(-1)}>
                    ⬅ Volver
                </button>

            </div>

            {/* FILTROS */}
            <div className="historial-filters">

                <select
                    name="usuario"
                    value={filtros.usuario}
                    onChange={cambiarFiltro}
                >
                    <option value="">Todos los usuarios</option>
                    {usuariosUnicos.map((u, i) => (
                        <option key={i}>{u}</option>
                    ))}
                </select>

                <select
                    name="accion"
                    value={filtros.accion}
                    onChange={cambiarFiltro}
                >
                    <option value="">Todas las acciones</option>
                    {accionesUnicas.map((a, i) => (
                        <option key={i}>{a}</option>
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

            {/* LISTA */}
            <div className="historial-list">

                {historial
                    .filter(h => {

                        return (
                            (!filtros.usuario || h.usuario === filtros.usuario) &&
                            (!filtros.accion || h.accion === filtros.accion) &&
                            (!filtros.desde || h.fecha.substring(0, 10) >= filtros.desde) &&
                            (!filtros.hasta || h.fecha.substring(0, 10) <= filtros.hasta)
                        );

                    })
                    .map(h => (

                        <div className="historial-card" key={h.id}>

                            <div className="historial-top">

                                <div>
                                    <h3>{h.usuario}</h3>
                                    <span className="badge-action">
                                        {h.accion}
                                    </span>
                                </div>

                                <span className="historial-date">
                                    {h.fecha}
                                </span>

                            </div>

                            <p className="historial-detail">
                                {h.detalle}
                            </p>

                            <div className="historial-footer">
                                <span>ID Hallazgo: #{h.hallazgo_id}</span>
                            </div>

                        </div>

                    ))}

            </div>

        </div>
    );
}

export default HistorialCambios;