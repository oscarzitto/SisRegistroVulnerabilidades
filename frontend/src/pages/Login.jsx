import { useState } from "react";
import api from "../services/api";

function Login() {

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const enviar = async () => {

        const res = await api.post(
            "/login",
            {
                correo,
                password
            });

        localStorage.setItem(
            "token",
            res.data.token
        );

        window.location="/dashboard";

    };

    return (

        <div>

            <h1>Login</h1>

            <input
                placeholder="correo"
                onChange={(e) => setCorreo(e.target.value)}
            />

            <input
                type="password"
                placeholder="contraseña"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={enviar}>
                Entrar
            </button>

        </div>

    );

}

export default Login;