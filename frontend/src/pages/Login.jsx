import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import "./login.css";

function Login() {

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const [mostrar, setMostrar] = useState(false);

    const enviar = async () => {

        try {

            const res = await api.post("/login", {
                correo,
                password
            });

            const data = res.data;

            // 🔴 SI DEBE CAMBIAR PASSWORD
            if (data.mustChangePassword) {

                localStorage.setItem("token", data.token);
                localStorage.setItem("usuario", JSON.stringify(data.usuario));

                navigate("/cambiar-password");
                return;
            }

            // 🟢 LOGIN NORMAL
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            navigate("/dashboard");

        }

        catch (error) {

            alert(
                error.response?.data?.mensaje ||
                "Error al iniciar sesión"
            );

        }

    };

    return (
        <div className="login-container">

            <div className="login-glow"></div>

            <div className="login-card">

                <h1>🔐 Login</h1>

                <input
                    placeholder="Correo"
                    onChange={(e) => setCorreo(e.target.value)}
                />

                <div style={{ position: "relative" }}>

                    <input
                        type={mostrar ? "text" : "password"}
                        placeholder="Contraseña"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="button"
                        onClick={() => setMostrar(!mostrar)}
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
                        {mostrar ? "🙈" : "👁️"}
                    </button>

                </div>

                <button onClick={enviar}>
                    Entrar
                </button>

            </div>

        </div>
    );

}

export default Login;