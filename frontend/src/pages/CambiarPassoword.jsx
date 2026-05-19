import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CambiarPassword() {

    const navigate = useNavigate();

    const [actual, setActual] = useState("");
    const [nueva, setNueva] = useState("");
    const [confirmar, setConfirmar] = useState("");

    const [mostrarNueva, setMostrarNueva] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
    const [mostrarActual, setMostrarActual] = useState(false);

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
        <div className="login-container">

            <div className="login-glow"></div>

            <div className="login-card">

                <h1>🔐 Cambiar contraseña</h1>

                <p style={{
                    fontSize: "12px",
                    opacity: 0.7,
                    marginBottom: "10px",
                    textAlign: "center"
                }}>
                    La contraseña debe tener al menos <b>8 caracteres</b>,
                    una <b>mayúscula</b> y un <b>número</b>.
                </p>

                <form onSubmit={enviar}>

                    <input
                        type="password"
                        placeholder="Contraseña actual"
                        onChange={(e) => setActual(e.target.value)}
                    />

                    <div style={{ position: "relative" }}>

                        <input
                            type={mostrarNueva ? "text" : "password"}
                            placeholder="Nueva contraseña"
                            onChange={(e) => setNueva(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setMostrarNueva(!mostrarNueva)}
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                color: "white"
                            }}
                        >
                            {mostrarNueva ? "🙈" : "👁️"}
                        </button>

                    </div>

                    <div style={{ position: "relative" }}>

                        <input
                            type={mostrarConfirmar ? "text" : "password"}
                            placeholder="Confirmar contraseña"
                            onChange={(e) => setConfirmar(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                color: "white"
                            }}
                        >
                            {mostrarConfirmar ? "🙈" : "👁️"}
                        </button>

                    </div>

                    <button type="submit">
                        Actualizar contraseña
                    </button>

                </form>

                <button
                    onClick={() => navigate(-1)}
                    className="secondary"
                >
                    Atrás
                </button>

            </div>

        </div>
    );

}

export default CambiarPassword;