import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./crearhallazgo.css";

function CrearHallazgo() {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [imagen, setImagen] = useState(null);
    const [mostrarImagen, setMostrarImagen] = useState(true);
    const [imagenGrande, setImagenGrande] = useState(null);

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
        severidad: "Baja",
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

        // quitar espacios
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


        // campos vacíos
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

        // validar fecha

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
                "El año debe estar entre 2020 y 2035"
            );

            return;

        }


        // evitar fechas futuras

        if (

            fechaSeleccionada > hoy

        ) {

            alert(
                "No puedes registrar fechas futuras"
            );

            return;

        }


        // construir FormData
        const formData = new FormData();

        Object.keys(datos).forEach(key => {

            formData.append(
                key,
                datos[key]
            );

        });

        // agregar imagen si existe
        if (imagen) {

            formData.append(
                "imagen",
                imagen
            );

        }


        // envío

        const res =
            await fetch(
                "http://localhost:3000/hallazgos",
                {

                    method: "POST",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    },

                    body: formData

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
        <div className="hallazgo-container">

            <div className="hallazgo-card">

                <h1>🛡 Crear Hallazgo</h1>

                <form onSubmit={enviar} className="hallazgo-form">

                    {/* FECHA */}
                    <div className="form-group">
                        <label>Fecha</label>
                        <input
                            name="fecha"
                            type="date"
                            value={form.fecha}
                            onChange={cambiar}
                            min="2020-01-01"
                            max={fechaMaxima}

                        />
                    </div>

                    {/* ACTIVO / TIPO */}
                    <div className="form-row">

                        <div className="form-group">
                            <label>Activo afectado</label>
                            <input
                                name="activo_afectado"
                                placeholder="Ej: Servidor web"
                                onChange={cambiar}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tipo</label>
                            <input
                                name="tipo"
                                placeholder="Ej: SQL Injection"
                                onChange={cambiar}
                            />
                        </div>

                    </div>

                    {/* SEVERIDAD / ESTADO */}
                    <div className="form-row">

                        <div className="form-group">
                            <label>Severidad</label>
                            <select
                                name="severidad"
                                value={form.severidad}
                                onChange={cambiar}
                            >
                                <option>Baja</option>
                                <option>Media</option>
                                <option>Alta</option>
                                <option>Crítica</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Estado</label>
                            <select
                                name="estado"
                                value={form.estado}
                                onChange={cambiar}
                            >
                                <option>Nuevo</option>
                                <option>En análisis</option>
                                <option>En remediación</option>
                                <option>Mitigado</option>
                                <option>Cerrado</option>
                            </select>
                        </div>

                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            placeholder="Describe la vulnerabilidad..."
                            onChange={cambiar}
                        />
                    </div>

                    {/* EVIDENCIA / RECOMENDACIÓN */}
                    <div className="form-group">

                        <label>Evidencia</label>

                        <input
                            name="evidencia"
                            placeholder="URL, log, texto, referencia..."
                            onChange={cambiar}
                        />

                    </div>


                    <div className="form-group">

                        <label>Evidencia imagen</label>

                        {/* preview */}
                        {imagen && (

                            <>

                                <img
                                    src={URL.createObjectURL(imagen)}
                                    alt="preview"

                                    onClick={() =>
                                        setImagenGrande(
                                            URL.createObjectURL(imagen)
                                        )
                                    }

                                    style={{
                                        width: "100%",
                                        maxHeight: "250px",
                                        objectFit: "contain",
                                        borderRadius: "10px",
                                        background: "#111",
                                        cursor: "zoom-in"
                                    }}
                                />

                                <button
                                    type="button"
                                    style={{
                                        marginBottom: "10px"
                                    }}

                                    onClick={() => {

                                        const confirmar =
                                            window.confirm(
                                                "¿Deseas quitar la imagen?"
                                            );

                                        if (confirmar) {

                                            setImagen(null);

                                        }

                                    }}

                                >

                                    🗑 Quitar imagen

                                </button>

                            </>

                        )}

                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png"

                            onChange={(e) => {

                                const archivo = e.target.files[0];

                                if (archivo) {

                                    setImagen(archivo);

                                }

                            }}

                        />

                        <small
                            style={{
                                opacity: 0.6,
                                fontSize: "12px"
                            }}
                        >
                            Formatos permitidos: JPG, JPEG y PNG
                        </small>

                    </div>


                    <div className="form-group">

                        <label>Recomendación</label>

                        <input
                            name="recomendacion"
                            placeholder="Cómo mitigarlo..."
                            onChange={cambiar}
                        />

                    </div>

                    {/* RESPONSABLE */}
                    <div className="form-group">
                        <label>Responsable</label>
                        <select
                            name="responsable"
                            value={form.responsable}
                            onChange={cambiar}
                        >
                            <option value="">
                                Seleccionar responsable
                            </option>

                            {usuarios.map(u => (
                                <option key={u.id} value={u.nombre}>
                                    {u.nombre} ({u.rol})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* BOTONES */}
                    <div className="form-actions">

                        <button type="submit">
                            💾 Guardar hallazgo
                        </button>

                        <button
                            type="button"
                            className="secondary"
                            onClick={() => navigate(-1)}
                        >
                            ↩ Cancelar
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );

}

export default CrearHallazgo;