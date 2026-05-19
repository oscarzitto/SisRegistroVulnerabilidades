import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./hallazgos.css";

function Hallazgos() {

    const [token] = useState(
        localStorage.getItem("token")
    );

    const [hallazgos, setHallazgos] = useState([]);

    const activosUnicos = [
        ...new Set(hallazgos.map(h => h.activo_afectado))
    ];

    const responsablesUnicos = [
        ...new Set(
            hallazgos.map(h => h.responsable)
        )
    ];

    const usuario =
        JSON.parse(
            localStorage.getItem("usuario")
        );

    const navigate = useNavigate();

    const [filtros, setFiltros] = useState({
        estado: "",
        severidad: "",
        activo: "",
        responsable: "",
        desde: "",
        hasta: ""
    });

    function cambiarFiltro(e) {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value
        });
    }

    function limpiarFiltros() {
        setFiltros({
            estado: "",
            severidad: "",
            activo: "",
            responsable: "",
            desde: "",
            hasta: ""
        });
    }

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

        const nuevoEstado = window.prompt(
            "Escribe el estado:\nNuevo\nEn análisis\nEn remediación\nMitigado\nCerrado"
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

    async function eliminar(id) {

        const token = localStorage.getItem("token");

        const confirmacion = confirm("¿Seguro que quieres eliminar este hallazgo?");

        if (!confirmacion) return;

        const res = await fetch(
            `http://localhost:3000/hallazgos/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        alert(data.mensaje);

        window.location.reload();

    }

    return (
        <div className="hallazgos-container">

            {/* HEADER */}
            <div className="hallazgos-header">

                <h1>🛡 Hallazgos de Vulnerabilidades</h1>

                <div className="hallazgos-actions">



                    <button onClick={() => navigate("/historial-cambios")}>
                        📜 Historial
                    </button>

                    <button onClick={exportar}>
                        📤 Exportar CSV
                    </button>

                    <button className="secondary" onClick={() => navigate("/dashboard")}>
                        ⬅ Volver
                    </button>

                </div>

            </div>

            {/* FILTROS */}
            <div className="hallazgos-filters">

                <select name="estado" value={filtros.estado} onChange={cambiarFiltro}>
                    <option value="">Estado</option>
                    <option>Nuevo</option>
                    <option>En análisis</option>
                    <option>En remediación</option>
                    <option>Mitigado</option>
                    <option>Cerrado</option>
                </select>

                <select name="severidad" value={filtros.severidad} onChange={cambiarFiltro}>
                    <option value="">Severidad</option>
                    <option>Baja</option>
                    <option>Media</option>
                    <option>Alta</option>
                    <option>Crítica</option>
                </select>

                <select name="activo" value={filtros.activo} onChange={cambiarFiltro}>
                    <option value="">Activo</option>
                    {activosUnicos.map((a, i) => (
                        <option key={i}>{a}</option>
                    ))}
                </select>

                <select name="responsable" value={filtros.responsable} onChange={cambiarFiltro}>
                    <option value="">Responsable</option>
                    {responsablesUnicos.map((r, i) => (
                        <option key={i}>{r}</option>
                    ))}
                </select>

                <input type="date" name="desde" value={filtros.desde} onChange={cambiarFiltro} />
                <input type="date" name="hasta" value={filtros.hasta} onChange={cambiarFiltro} />

                <button onClick={limpiarFiltros}>
                    🧹 Limpiar filtros
                </button>

                <button onClick={() => navigate("/crear-hallazgo")}>
                    ➕ Crear
                </button>

            </div>

            {/* LISTA */}
            <div className="hallazgos-list">

                {hallazgos
                    .filter(h => {

                        return (
                            (!filtros.estado || h.estado === filtros.estado) &&
                            (!filtros.severidad || h.severidad === filtros.severidad) &&
                            (!filtros.activo || h.activo_afectado.toLowerCase().includes(filtros.activo.toLowerCase())) &&
                            (!filtros.responsable || h.responsable === filtros.responsable) &&
                            (!filtros.desde || h.fecha >= filtros.desde) &&
                            (!filtros.hasta || h.fecha <= filtros.hasta)
                        );

                    })
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .map(h => (

                        <div className="hallazgo-card" key={h.id}>

                            <div className="hallazgo-top">

                                <div>
                                    <h3>#{h.id} - {h.activo_afectado}</h3>
                                    <span className={`badge ${h.severidad}`}>
                                        {h.severidad}
                                    </span>
                                </div>

                                {usuario?.rol === "admin" && (
                                    <button className="danger" onClick={() => eliminar(h.id)}>
                                        🗑
                                    </button>
                                )}

                            </div>

                            <p>{h.descripcion}</p>

                            <div className="hallazgo-meta">

                                <span>📌 {h.estado}</span>
                                <span>👤 {h.responsable}</span>
                                <span>📅 {h.fecha}</span>

                            </div>

                            <button onClick={() => navigate(`/editar-hallazgo/${h.id}`)}>
                                ✏️ Editar
                            </button>

                        </div>

                    ))}

            </div>

        </div>
    );

}

export default Hallazgos;