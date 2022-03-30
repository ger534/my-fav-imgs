import { useState } from "react";

//firebase authentication
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

/* third party packages */
import { Button, Container, Input, useMediaQuery } from '@mui/material';

//routing
import { useNavigate } from "react-router-dom";

/* style */
import './login.css'

function Login(props) {

    const matches = useMediaQuery('(min-width:1200px)');

    const navigate = useNavigate();

    const auth = getAuth();

    const contextUser = JSON.parse(sessionStorage.getItem('user'));

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")

    const logout = () => {
        sessionStorage.removeItem('user')
        navigate(0)
    }

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                sessionStorage.setItem('user', JSON.stringify(user));
                navigate(0)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode === "auth/user-not-found"){
                    setError("Este email no ha sido registrado.")
                } else if(errorCode === "auth/internal-error"){
                    setError("La contraseña no es válida.")
                } else if(errorCode === "auth/invalid-email"){
                    setError("La dirección de correo electrónico no es válida.")
                }else{
                    setError("Ha ocurrido un error " + errorMessage)
                }
                
            });
    }

    return (
        <>
            <br></br>
            {/* BIENVENIDO A ... */}
            {contextUser ? <>
                <Container style={matches ? { width: "50%" } : { height: "100vh" }}>
                    <h1 style={{ textAlign: "center" }}>Actualmente en sesión con el correo: {contextUser.email}</h1>
                    <Button fullWidth variant="contained" style={{ backgroundColor: "#ff4702" }} onClick={() => navigate('/')}>Administrar mis imágenes</Button>
                    <Button fullWidth variant="contained" style={{ backgroundColor: "#ffdacc", color: "#ff4702" }} onClick={logout}>Cerrar sesión</Button>
                </Container>
            </> : <>
                <Container style={matches ? { width: "50%" } : { height: "100vh" }}>
                    <h1 style={{ textAlign: "center" }}>Iniciar Sesión</h1>
                    <Input
                        style={{ backgroundColor: "white" }}
                        placeholder="Email"
                        label="Email"
                        id="email"
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        value={email}
                        fullWidth
                    />
                    <br />
                    <Input
                        style={{ backgroundColor: "white" }}
                        placeholder="Password"
                        label="Password"
                        id="password"
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        value={password}
                        fullWidth
                    />
                    <p>{error}</p>
                    <p>¿No tienes cuenta? <span style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }} onClick={() => { navigate("/signup") }}>regístrate</span></p>
                    <Button fullWidth variant="contained" style={{ backgroundColor: "#ff4702" }} onClick={login}>Iniciar sesión</Button>
                    <Button fullWidth variant="contained" style={{ backgroundColor: "#ffdacc", color: "#ff4702" }} onClick={() => navigate('/')}>Volver</Button>
                </Container>
            </>}
        </>
    )
}
export default Login;


