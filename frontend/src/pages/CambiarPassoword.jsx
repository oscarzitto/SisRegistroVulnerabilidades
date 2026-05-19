import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CambiarPassword() {

    const navigate = useNavigate();

    const [actual, setActual] = useState("");
    const [nueva, setNueva] = useState("");
    const [confirmar, setConfirmar] = useState("");

    const token = localStorage.getItem("token");

    async function enviar(e) {
        e.preventDefault();

        // 1. validar que coincidan
        if (nueva !== confirmar) {
            alert("Las contraseñas no coinciden");
            return;
        }

        // 2. validación básica de seguridad
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!regex.test(nueva)) {
            alert(
                "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número"
            );
            return;
        }

        try {

            const res = await api.post(
                "/cambiar-password",
                {
                    actual,
                    nueva
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(res.data.mensaje);

            // limpiar sesión de estado inicial
            const usuario =
                JSON.parse(localStorage.getItem("usuario"));

            usuario.must_change_password = 0;

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );

            navigate("/dashboard");

        } catch (error) {

            alert(
                error.response?.data?.mensaje ||
                "Error al cambiar contraseña"
            );

        }
    }

    return (

        <div>

            <h1>Cambiar contraseña</h1>

            <form onSubmit={enviar}>

                <input
                    type="password"
                    placeholder="Contraseña actual"
                    onChange={(e) =>
                        setActual(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    onChange={(e) =>
                        setNueva(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    onChange={(e) =>
                        setConfirmar(e.target.value)
                    }
                />

                <button type="submit">
                    Cambiar contraseña
                </button>

            </form>

            <button type="submit" onClick={() => navigate(-1)} className="secondary">
                Atras
            </button>

        </div>

    );

}

export default CambiarPassword;