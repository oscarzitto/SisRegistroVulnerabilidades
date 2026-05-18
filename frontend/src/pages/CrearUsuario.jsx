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

        const correo =
            `${form.nombre.toLowerCase()}@${form.rol}.cl`;

        const password =
            `${form.nombre}123`;

        const res =
            await fetch(
                "http://localhost:3000/register",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        nombre:
                            form.nombre,

                        correo,

                        password,

                        rol:
                            form.rol

                    })

                });

        const data =
            await res.json();

        alert(
            `${data.mensaje}

Correo:
${correo}

Contraseña:
${password}`
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