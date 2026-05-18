import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CrearHallazgo() {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [form, setForm] = useState({

        fecha: "",
        activo_afectado: "",
        tipo: "",
        severidad: "",
        descripcion: "",
        evidencia: "",
        recomendacion: "",
        estado: "Nuevo",
        responsable: ""

    });

    function cambiar(e) {

        setForm({

            ...form,
            [e.target.name]: e.target.value

        });

    }

    async function enviar(e) {

        e.preventDefault();

        const res = await fetch(
            "http://localhost:3000/hallazgos",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify(form)

            });

        const data = await res.json();

        alert(data.mensaje);

    }

    return (

        <div>

            <h1>Crear Hallazgo</h1>

            <form onSubmit={enviar}>

                <input
                    name="fecha"
                    type="date"
                    onChange={cambiar}
                />

                <input
                    name="activo_afectado"
                    placeholder="Activo"
                    onChange={cambiar}
                />

                <input
                    name="tipo"
                    placeholder="Tipo"
                    onChange={cambiar}
                />

                <select
                    name="severidad"
                    value={form.severidad}
                    onChange={cambiar}
                >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                </select>

                <input
                    name="descripcion"
                    placeholder="Descripción"
                    onChange={cambiar}
                />

                <input
                    name="evidencia"
                    placeholder="Evidencia"
                    onChange={cambiar}
                />

                <input
                    name="recomendacion"
                    placeholder="Recomendación"
                    onChange={cambiar}
                />

                <select
                    name="estado"
                    value={form.estado}
                    onChange={cambiar}
                >
                    <option value="Nuevo">Nuevo</option>
                    <option value="En análisis">En análisis</option>
                    <option value="En remediación">En remediación</option>
                    <option value="Mitigado">Mitigado</option>
                    <option value="Cerrado">Cerrado</option>
                </select>

                <input
                    name="responsable"
                    placeholder="Responsable"
                    onChange={cambiar}
                />

                <button onClick={() => navigate("/hallazgos")}>
                    Guardar
                </button>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    Atrás
                </button>

            </form>

        </div>

    );

}

export default CrearHallazgo;