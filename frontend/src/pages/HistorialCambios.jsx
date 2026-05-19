import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div>

            <h1>Historial de cambios</h1>

            <button onClick={() => navigate(-1)}>
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
                        Todos usuarios
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


                <select
                    name="accion"
                    value={filtros.accion}
                    onChange={cambiarFiltro}
                >

                    <option value="">
                        Todas acciones
                    </option>

                    {

                        accionesUnicas.map((a, i) => (

                            <option
                                key={i}
                                value={a}
                            >

                                {a}

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

            {historial

                .filter(h => {

                    const cumpleUsuario =

                        !filtros.usuario ||

                        h.usuario === filtros.usuario;


                    const cumpleAccion =

                        !filtros.accion ||

                        h.accion === filtros.accion;


                    const cumpleDesde =

                        !filtros.desde ||

                        h.fecha.substring(0, 10)
                        >=
                        filtros.desde;


                    const cumpleHasta =

                        !filtros.hasta ||

                        h.fecha.substring(0, 10)
                        <=
                        filtros.hasta;


                    return (

                        cumpleUsuario &&
                        cumpleAccion &&
                        cumpleDesde &&
                        cumpleHasta

                    );

                })

                .map(h => (

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