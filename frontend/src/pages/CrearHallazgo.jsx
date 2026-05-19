import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CrearHallazgo() {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {

        fetch(
            "http://localhost:3000/usuarios",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(res => res.json())
            .then(data => {

                setUsuarios(data);

            });

    }, []);

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

                <select
                    name="responsable"
                    value={form.responsable}
                    onChange={cambiar}
                >

                    <option value="">
                        Seleccionar responsable
                    </option>

                    {usuarios.map(u => (

                        <option
                            key={u.id}
                            value={u.nombre}
                        >
                            {u.nombre} ({u.rol})
                        </option>

                    ))}

                </select>

                <button type="submit">
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