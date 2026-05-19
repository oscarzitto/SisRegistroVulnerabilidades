import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import "./login.css";

function Login() {

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

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

        <div>

            <h1>Login</h1>

            <input
                placeholder="correo"
                onChange={(e) =>
                    setCorreo(e.target.value)
                }
            />

            <input
                type="password"
                placeholder="contraseña"
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <button onClick={enviar}>
                Entrar
            </button>

        </div>

    );

}

export default Login;