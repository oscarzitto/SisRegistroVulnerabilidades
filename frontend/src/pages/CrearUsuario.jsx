import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./crearusuario.css";

function CrearUsuario() {

    const token =
        localStorage.getItem("token");

    const navigate =
        useNavigate();

    const [form, setForm] = useState({

        nombre: "",
        rol: "analista"

    });

    const [resultado, setResultado] = useState(null);

    function cambiar(e) {

        setForm({

            ...form,
            [e.target.name]:
                e.target.value

        });

    }

    async function enviar(e) {
        e.preventDefault();

        const nombreLimpio = form.nombre.trim();

        // 1. validar caracteres (solo letras y espacios)
        const regexNombre =
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (!regexNombre.test(nombreLimpio)) {
            alert("El nombre contiene caracteres no válidos");
            return;
        }

        // 2. validar 1 o 2 palabras
        const partes = nombreLimpio.split(" ").filter(p => p);

        if (partes.length < 1 || partes.length > 2) {
            alert("Solo nombre y apellido (máx 2 palabras)");
            return;
        }

        // 3. correo base (minúscula)
        const baseCorreo =
            partes
                .slice(0, 2)
                .join(".")
                .toLowerCase();

        const correo =
            `${baseCorreo}@${form.rol}.cl`;

        // 4. password temporal segura
        const password =
            `pass${Math.floor(100 + Math.random() * 9000)}`;

        const res = await fetch(
            "http://localhost:3000/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: nombreLimpio,
                    correo,
                    password,
                    rol: form.rol
                })
            }
        );

        const data = await res.json();

        setResultado({
            mensaje: data.mensaje,
            correo,
            password
        });

        if (res.ok) {
            setForm({ nombre: "", rol: "analista" });
        }
    }

    return (

        <div>

            <h1>
                Crear Usuario
            </h1>

            <form
                onSubmit={enviar}
            >

                <input
                    name="nombre"
                    placeholder="Nombre"
                    onChange={cambiar}
                />

                <select
                    name="rol"
                    onChange={cambiar}
                >

                    <option>
                        analista
                    </option>

                    <option>
                        admin
                    </option>

                </select>

                {resultado && (
                    <div style={{
                        marginTop: "20px",
                        padding: "10px",
                        border: "1px solid green",
                        backgroundColor: "#eaffea"
                    }}>

                        <h3>Usuario creado correctamente</h3>

                        <p><b>Mensaje:</b> {resultado.mensaje}</p>
                        <p><b>Correo:</b> {resultado.correo}</p>
                        <p><b>Contraseña temporal:</b> {resultado.password}</p>

                        <p style={{ color: "red" }}>
                            ⚠ Se recomienda cambiar la contraseña al iniciar sesión
                        </p>

                    </div>
                )}

                <button type="submit">
                    Crear
                </button>

            </form>

            <button className="secondary"
                type="button"
                onClick={() => navigate(-1)}
            >
                Volver
            </button>

        </div>

    );

}

export default CrearUsuario;