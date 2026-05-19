import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditarHallazgo() {

    const token = localStorage.getItem("token");
    const [usuarios, setUsuarios] = useState([]);
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

        // cargar usuarios
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


        // cargar hallazgo actual
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

                const hallazgo =
                    data.find(
                        h => h.id == id
                    );

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

        const datos = {

            ...form,

            activo_afectado:
                form.activo_afectado.trim(),

            tipo:
                form.tipo.trim(),

            descripcion:
                form.descripcion.trim(),

            evidencia:
                form.evidencia.trim(),

            recomendacion:
                form.recomendacion.trim()

        };


        if (

            !datos.fecha ||
            !datos.activo_afectado ||
            !datos.tipo ||
            !datos.descripcion ||
            !datos.evidencia ||
            !datos.recomendacion ||
            !datos.responsable

        ) {

            alert(
                "Completa todos los campos"
            );

            return;

        }

        const fechaSeleccionada =
            new Date(datos.fecha);

        const hoy =
            new Date();

        hoy.setHours(
            0, 0, 0, 0
        );

        fechaSeleccionada.setHours(
            0, 0, 0, 0
        );


        if (

            fechaSeleccionada > hoy

        ) {

            alert(
                "No puedes registrar fechas futuras"
            );

            return;

        }

        const año =
            fechaSeleccionada.getFullYear();


        if (

            año < 2020 ||
            año > 2035

        ) {

            alert(
                "Año inválido"
            );

            return;

        }


        if (

            fechaSeleccionada > hoy

        ) {

            alert(
                "La fecha no puede ser futura"
            );

            return;

        }


        const res =
            await fetch(
                `http://localhost:3000/hallazgos/${id}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(datos)

                }
            );


        const data = await res.json();

        alert(data.mensaje);

        if (res.ok) {

            navigate("/hallazgos");

        }

    }

    const hoyLocal = new Date();

    const fechaMaxima =
        `${hoyLocal.getFullYear()}-${String(hoyLocal.getMonth() + 1)
            .padStart(2, "0")
        }-${String(hoyLocal.getDate())
            .padStart(2, "0")
        }`;

    return (

        <div>

            <h1>Editar Hallazgo</h1>

            <form onSubmit={enviar}>

                <input
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={cambiar}
                    min="2020-01-01"
                    max={fechaMaxima}
                />

                <input
                    name="activo_afectado"
                    placeholder="Activo afectado"
                    value={form.activo_afectado}
                    onChange={cambiar}
                />

                <input
                    name="tipo"
                    placeholder="Tipo de vulnerabilidad"
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
                    placeholder="Descripción"
                    value={form.descripcion}
                    onChange={cambiar}
                />

                <input
                    name="evidencia"
                    placeholder="Evidencia encontrada"
                    value={form.evidencia}
                    onChange={cambiar}
                />

                <input
                    name="recomendacion"
                    placeholder="Recomendación"
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

                <button>
                    Guardar cambios
                </button>

                <button className="secondary"
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