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

        const nombreLimpio =
            form.nombre
                .trim()
                .replace(/\s+/g, " ");


        const regexNombre =
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;


        if (

            !regexNombre.test(
                nombreLimpio
            )

        ) {

            alert(
                `Debe ingresar:

                Nombre Apellido

                Solo letras y separados por un espacio`
            );

            return;

        }

        e.preventDefault();

        const correoBase =

            nombreLimpio
                .toLowerCase()
                .replace(" ", ".");

        const correo =

            `${correoBase}@${form.rol}.cl`;

        const password =

            `pass${Math.floor(
                10 +
                Math.random() * 90
            )
            }`;

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