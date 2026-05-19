import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CrearUsuario() {

    const token =
        localStorage.getItem("token");

    const navigate =
        useNavigate();

    const [form, setForm] = useState({

        nombre: "",
        rol: "analista"

    });

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
        const partes = nombreLimpio.split(" ");

        const regexNombre =
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        // 1. validar caracteres
        if (!regexNombre.test(nombreLimpio)) {
            alert("El nombre contiene caracteres no válidos");
            return;
        }

        // 2. validar solo nombre y apellido (máx 2 palabras)
        if (partes.length > 2) {
            alert("Ingresa solo nombre y apellido");
            return;
        }

        // 3. validar que no esté vacío
        if (partes.length < 1 || nombreLimpio.length === 0) {
            alert("El nombre no puede estar vacío");
            return;
        }

        // 🔹 generar correo
        const correoBase =
            nombreLimpio
                .toLowerCase()
                .replace(/\s+/g, "."); // mejor que replace(" ", ".")

        const correo =
            `${correoBase}@${form.rol}.cl`;

        // 🔹 password temporal
        const password =
            `pass${Math.floor(10 + Math.random() * 900)}`;

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

        alert(
            `${data.mensaje}

                Correo:
                ${correo}

                Contraseña temporal:
                ${password}

                Se recomienda cambiar la contraseña al iniciar sesión.`
        );
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

                <button onClick={() => navigate(-1)}>
                    Crear
                </button>

            </form>

            <button
                type="button"
                onClick={() => navigate(-1)}
            >
                Volver
            </button>

        </div>

    );

}

export default CrearUsuario;