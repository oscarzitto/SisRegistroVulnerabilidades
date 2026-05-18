import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditarHallazgo() {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { id } = useParams();

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

    // 🟡 CARGAR DATOS DEL HALLAZGO
    useEffect(() => {

        fetch(`http://localhost:3000/hallazgos`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const hallazgo = data.find(h => h.id == id);
                if (hallazgo) {
                    setForm(hallazgo);
                }
            });

    }, []);

    function cambiar(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    // 🟢 GUARDAR EDICIÓN
    async function enviar(e) {
        e.preventDefault();

        const res = await fetch(
            `http://localhost:3000/hallazgos/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            }
        );

        const data = await res.json();

        alert(data.mensaje);

        navigate("/hallazgos");
    }

    return (

        <div>

            <h1>Editar Hallazgo</h1>

            <form onSubmit={enviar}>

                <input
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={cambiar}
                />

                <input
                    name="activo_afectado"
                    value={form.activo_afectado}
                    onChange={cambiar}
                />

                <input
                    name="tipo"
                    value={form.tipo}
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
                    value={form.descripcion}
                    onChange={cambiar}
                />

                <input
                    name="evidencia"
                    value={form.evidencia}
                    onChange={cambiar}
                />

                <input
                    name="recomendacion"
                    value={form.recomendacion}
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
                    value={form.responsable}
                    onChange={cambiar}
                />

                <button>
                    Guardar cambios
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

export default EditarHallazgo;